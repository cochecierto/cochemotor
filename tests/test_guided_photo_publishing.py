import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class GuidedPhotoPublishingTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ROOT / "publicar.html").read_text(encoding="utf-8")
        cls.api = (ROOT / "api" / "index.php").read_text(encoding="utf-8")
        cls.css = (ROOT / "styles.css").read_text(encoding="utf-8")

    def test_ten_guided_slots_have_matching_optimized_assets(self):
        block = self.html.split("const slots = [", 1)[1].split("\n      ];", 1)[0]
        slots = re.findall(r"key:'([^']+)'.*?image:'([^']+)'", block)
        self.assertEqual(len(slots), 10)
        self.assertEqual(
            [key for key, _ in slots],
            ["front-right", "rear", "left-side", "right-side", "front-interior",
             "rear-interior", "dashboard-km", "engine", "trunk", "tire-or-detail"],
        )
        for _, asset in slots:
            path = ROOT / asset
            self.assertTrue(path.is_file(), asset)
            self.assertLess(path.stat().st_size, 100_000, asset)
            self.assertEqual(path.read_bytes()[8:12], b"WEBP", asset)

    def test_slot_ten_allows_tires_or_free_detail(self):
        self.assertIn("Neumáticos o detalle", self.html)
        self.assertIn("desperfecto o detalle importante", self.html)

    def test_light_logo_is_used_on_white_publish_and_access_surfaces(self):
        access = (ROOT / "acceso.html").read_text(encoding="utf-8")
        logo = "assets/brand/logos/cochemotor-horizontal-light.png"
        self.assertIn(logo, self.html)
        self.assertIn(logo, access)

    def test_publish_page_has_scannable_sections_and_mobile_layout(self):
        for section in ("Datos del coche", "Fotos que enseñan bien tu coche", "Datos de contacto"):
            self.assertIn(section, self.html)
        self.assertIn('class="publish-topbar"', self.html)
        self.assertIn('class="publish-form-footer"', self.html)
        self.assertIn("@media(max-width:600px)", self.css)
        self.assertIn("@media(max-width:360px)", self.css)
        self.assertIn("position:fixed", self.css)

    def test_browser_draft_uses_indexeddb_and_not_file_base64(self):
        self.assertIn("indexedDB.open(dbName", self.html)
        self.assertIn("photos", self.html)
        self.assertNotIn("readAsDataURL", self.html)

    def test_api_restricts_upload_count_size_and_image_content(self):
        self.assertIn("count($names)>10", self.api)
        self.assertIn("8 * 1024 * 1024", self.api)
        self.assertIn("getimagesize", self.api)
        self.assertIn("imagecreatefromstring", self.api)
        self.assertIn("imagewebp", self.api)
        self.assertIn("email_verified", self.api)
        self.assertIn("already_saved", self.api)
        self.assertIn("$pdo->rollBack()", self.api)
        self.assertIn("@unlink($directory.'/'.$filename)", self.api)


if __name__ == "__main__":
    unittest.main()
