import hashlib
import os
import re
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "hostinger-release-transaction.sh"


class HostingerReleaseTransactionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        source = SCRIPT.read_text(encoding="utf-8")
        asset_block = source.split("assets=(", 1)[1].split(")", 1)[0]
        cls.assets = asset_block.split()
        cls.bash = shutil.which("bash")

    def setUp(self):
        if not self.bash:
            self.skipTest("bash is available in the GitHub Actions release runner")
        self.temp = tempfile.TemporaryDirectory(prefix="cochemotor-release-")
        self.parent = Path(self.temp.name)
        self.root = self.parent / "public_html"
        self.stage_name = ".cochemotor-stage-123-1-" + "a" * 12
        self.backup_name = ".cochemotor-backup-123-1-" + "a" * 12
        self.stage = self.parent / self.stage_name
        self.backup = self.parent / self.backup_name
        self.release = "a" * 40
        self.root.mkdir()
        self.stage.mkdir()
        self._prepare_release()

    def tearDown(self):
        if hasattr(self, "temp"):
            self.temp.cleanup()

    def _prepare_release(self):
        checksum_lines = []
        for asset in self.assets:
            old_path = self.root / asset
            new_path = self.stage / asset
            old_path.parent.mkdir(parents=True, exist_ok=True)
            new_path.parent.mkdir(parents=True, exist_ok=True)
            old_path.write_text(f"old:{asset}\n", encoding="utf-8")
            new_contents = f"new:{asset}\n"
            new_path.write_text(new_contents, encoding="utf-8")
            checksum = hashlib.sha256(new_contents.encode("utf-8")).hexdigest()
            checksum_lines.append(f"{checksum}  {asset}\n")
        helper = "staged promote helper\n"
        (self.stage / "promote.sh").write_text(helper, encoding="utf-8")
        checksum_lines.append(f"{hashlib.sha256(helper.encode('utf-8')).hexdigest()}  promote.sh\n")
        (self.stage / "release.sha256").write_text("".join(checksum_lines), encoding="utf-8")

    def _run(self, mode, env=None):
        return subprocess.run(
            [self.bash, str(SCRIPT), mode, self.root.name, self.stage_name, self.backup_name, self.release],
            cwd=self.parent,
            env=env,
            capture_output=True,
            text=True,
            check=False,
        )

    def test_promoted_release_can_be_rolled_back_to_every_previous_file(self):
        promoted = self._run("promote")
        self.assertEqual(promoted.returncode, 0, promoted.stderr)
        for asset in self.assets:
            self.assertEqual((self.root / asset).read_text(encoding="utf-8"), f"new:{asset}\n")
        self.assertEqual((self.backup / ".release").read_text(encoding="utf-8"), self.release + "\n")

        rollback = self._run("rollback")
        self.assertEqual(rollback.returncode, 0, rollback.stderr)
        for asset in self.assets:
            self.assertEqual((self.root / asset).read_text(encoding="utf-8"), f"old:{asset}\n")

    def test_release_workflow_stages_every_allowlisted_asset_and_checks_its_transaction(self):
        workflow = (ROOT / ".github" / "workflows" / "deploy-seo-hostinger.yml").read_text(encoding="utf-8")
        match = re.search(r"assets=\(([^\n]+)\)", workflow)
        self.assertIsNotNone(match)
        self.assertEqual(set(match.group(1).split()), set(self.assets))
        self.assertIn("put scripts/hostinger-release-transaction.sh $stage/promote.sh", workflow)
        self.assertIn("rollback_on_exit", workflow)
        self.assertIn("promote.sh' rollback", workflow)
        self.assertIn("promotion_attempted=1", workflow)
        promotion_command = workflow.index("promote.sh' promote")
        remote_promotion_call = workflow.index('remote "$command"', promotion_command)
        self.assertLess(workflow.index("promotion_attempted=1"), promotion_command)
        self.assertLess(promotion_command, remote_promotion_call)
        self.assertIn("bash -n scripts/hostinger-release-transaction.sh", workflow)

    def test_remote_promotion_and_recovery_share_a_kernel_lock(self):
        source = SCRIPT.read_text(encoding="utf-8")
        self.assertIn("command -v flock", source)
        self.assertIn("flock --exclusive --wait 180 9", source)

    def test_failed_partial_promotion_restores_previous_files_automatically(self):
        bin_dir = self.parent / "bin"
        bin_dir.mkdir()
        counter = self.parent / "mv-count"
        shim = bin_dir / "mv"
        shim.write_text(
            "#!/usr/bin/env bash\n"
            "count=0; [[ ! -f \"$MV_FAIL_COUNTER\" ]] || count=$(cat \"$MV_FAIL_COUNTER\")\n"
            "count=$((count + 1)); printf '%s' \"$count\" > \"$MV_FAIL_COUNTER\"\n"
            "if (( count == 4 )); then exit 42; fi\n"
            "exec /usr/bin/mv \"$@\"\n",
            encoding="utf-8",
        )
        shim.chmod(0o755)
        env = os.environ.copy()
        env["PATH"] = str(bin_dir) + os.pathsep + env["PATH"]
        env["MV_FAIL_COUNTER"] = str(counter)

        failed = self._run("promote", env)
        self.assertEqual(failed.returncode, 42, failed.stderr)
        for asset in self.assets:
            self.assertEqual((self.root / asset).read_text(encoding="utf-8"), f"old:{asset}\n")
        self.assertTrue((self.backup / ".rollback-complete").exists())

    def test_client_rollback_recovers_partial_release_after_remote_process_loss(self):
        (self.backup / ".absent").mkdir(parents=True)
        for asset in self.assets:
            original = self.root / asset
            saved = self.backup / asset
            saved.parent.mkdir(parents=True, exist_ok=True)
            saved.write_text(original.read_text(encoding="utf-8"), encoding="utf-8")
        (self.backup / ".release").write_text(self.release + "\n", encoding="utf-8")
        (self.backup / ".promotion-started").touch()
        for asset in self.assets[:3]:
            (self.root / asset).write_text(f"partially-new:{asset}\n", encoding="utf-8")

        recovered = self._run("rollback")
        self.assertEqual(recovered.returncode, 0, recovered.stderr)
        for asset in self.assets:
            self.assertEqual((self.root / asset).read_text(encoding="utf-8"), f"old:{asset}\n")


if __name__ == "__main__":
    unittest.main()
