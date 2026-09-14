import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class PublicVehicleSheetActionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ROOT / "ficha.html").read_text(encoding="utf-8")

    def test_share_has_native_and_copy_fallback_with_accessible_status(self):
        self.assertIn('id="btn-share-native"', self.html)
        self.assertIn('id="share-status"', self.html)
        self.assertIn('aria-live="polite"', self.html)
        self.assertIn("navigator.share", self.html)
        self.assertIn("navigator.clipboard", self.html)
        self.assertIn("execCommand('copy')", self.html)

    def test_download_action_uses_print_friendly_view_and_preserves_public_url(self):
        self.assertIn('id="btn-download-pdf"', self.html)
        self.assertIn("window.print()", self.html)
        self.assertIn("@media print", self.html)
        self.assertIn("location.href", self.html)
        print_css = re.search(r"@media print\s*\{(.*?)\n\s*\}", self.html, re.S)
        self.assertIsNotNone(print_css)
        self.assertIn(".no-print", print_css.group(1))

    def test_whatsapp_message_keeps_vehicle_reference_and_user_in_control(self):
        self.assertIn("function openDirectWhatsApp()", self.html)
        self.assertIn("${currentCar.id}", self.html)
        self.assertIn("https://wa.me/", self.html)
        self.assertIn("window.open(url, '_blank')", self.html)
        self.assertNotIn("fetch(url", self.html)

    def test_mobile_sticky_actions_include_share_and_contact(self):
        self.assertIn('class="sticky-cta-actions"', self.html)
        self.assertIn('class="sticky-cta-share"', self.html)
        self.assertRegex(self.html, r"@media\s*\(max-width:\s*600px\)")
        self.assertIn("env(safe-area-inset-bottom", self.html)
        self.assertIn("grid-template-columns", self.html)

    def test_print_mode_hides_sticky_and_contact_controls(self):
        self.assertRegex(self.html, r"\.no-print[^\{]*,\s*\.sticky-cta-bar")
        self.assertIn("@page", self.html)


if __name__ == "__main__":
    unittest.main()
