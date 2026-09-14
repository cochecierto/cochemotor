import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ProfessionalRegistrationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.api = (ROOT / "api" / "index.php").read_text(encoding="utf-8")

    def test_registration_binds_one_value_for_each_insert_column(self):
        insert = re.search(
            r"prepare\('INSERT INTO professional_users\(([^)]*)\) VALUES\(([^)]*)\)'\)",
            self.api,
        )
        self.assertIsNotNone(insert, "Registration INSERT must be present")
        columns = [column.strip() for column in insert.group(1).split(",")]
        placeholders = insert.group(2).split(",")
        self.assertEqual(len(columns), len(placeholders))
        self.assertEqual(
            columns,
            ["user_id", "name", "email", "password_hash", "verification_token"],
        )

        registration_block = self.api[insert.end():self.api.index("catch (PDOException", insert.end())]
        execute = re.search(r"\$q->execute\(\[([^]]*)\]\)", registration_block)
        self.assertIsNotNone(execute, "Registration must bind values to the prepared query")
        self.assertEqual(
            execute.group(1),
            "$id,$name,$email,password_hash($password,PASSWORD_DEFAULT),$verify",
        )


if __name__ == "__main__":
    unittest.main()
