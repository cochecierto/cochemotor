import json
import tempfile
import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from pathlib import Path
from broker_core.repository import get_connection, init_db, save_coche_ideal_request, has_recent_coche_ideal_fingerprint, update_coche_ideal_status, list_coche_ideal_history

class CocheIdealRepositoryTests(unittest.TestCase):
    def test_status_update_is_audited(self):
        with tempfile.TemporaryDirectory() as folder:
            db = Path(folder) / "test.db"
            init_db(db)
            request = {"id":"ci-test-1", "consentVersion":"2026-09", "vehicle":{"brand":"Seat"}}
            with get_connection(db) as conn:
                save_coche_ideal_request(conn, request, "fp-test")
                self.assertTrue(has_recent_coche_ideal_fingerprint(conn, "fp-test"))
                self.assertTrue(update_coche_ideal_status(conn, "ci-test-1", "en revisión", "tester"))
                history = list_coche_ideal_history(conn, "ci-test-1")
            self.assertEqual(history[0]["previous_status"], "nueva")
            self.assertEqual(history[0]["new_status"], "en revisión")
            self.assertEqual(history[0]["actor"], "tester")

if __name__ == "__main__":
    unittest.main()