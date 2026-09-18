import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ProfessionalRegistrationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.api = (ROOT / "api" / "index.php").read_text(encoding="utf-8")

    def test_registration_binds_one_value_for_each_insert_column(self):
        insert = re.search(r"prepare\(\\?['\"]INSERT INTO professional_users\(([^)]*)\)", self.api)
        self.assertIsNotNone(insert, 'Registration INSERT must be present')
        columns = [column.strip() for column in insert.group(1).split(',')]
        self.assertIn('verification_token_hash', columns)
        self.assertIn('privacy_notice_version', columns)
        self.assertIn("hash('sha256',$verify)", self.api)


if __name__ == "__main__":
    unittest.main()

