import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[1]))

from broker_core.auth import can_update_profile, cleanup_expired_sessions, init_auth_schema
import sqlite3
from datetime import datetime, timedelta, timezone


class ProfileAuthorizationTests(unittest.TestCase):
    def test_profile_requires_a_session(self) -> None:
        self.assertFalse(can_update_profile(None, "usr-owner"))

    def test_profile_cannot_be_written_for_another_user(self) -> None:
        self.assertFalse(can_update_profile({"user_id": "usr-owner"}, "usr-other"))

    def test_profile_allows_the_authenticated_user(self) -> None:
        self.assertTrue(can_update_profile({"user_id": "usr-owner"}, "usr-owner"))

    def test_expired_sessions_are_cleaned(self) -> None:
        conn = sqlite3.connect(":memory:")
        init_auth_schema(conn)
        expired = (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat()
        conn.execute("INSERT INTO professional_sessions VALUES (?, ?, ?, ?)", ("expired-token", "usr-owner", expired, expired))
        conn.commit()
        self.assertEqual(cleanup_expired_sessions(conn), 1)


if __name__ == "__main__":
    unittest.main()
