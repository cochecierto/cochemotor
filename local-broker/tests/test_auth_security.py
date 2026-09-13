import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[1]))

from broker_core.auth import can_update_profile


class ProfileAuthorizationTests(unittest.TestCase):
    def test_profile_requires_a_session(self) -> None:
        self.assertFalse(can_update_profile(None, "usr-owner"))

    def test_profile_cannot_be_written_for_another_user(self) -> None:
        self.assertFalse(can_update_profile({"user_id": "usr-owner"}, "usr-other"))

    def test_profile_allows_the_authenticated_user(self) -> None:
        self.assertTrue(can_update_profile({"user_id": "usr-owner"}, "usr-owner"))


if __name__ == "__main__":
    unittest.main()
