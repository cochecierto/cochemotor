from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]


class BetaFeedbackReadinessTests(unittest.TestCase):
    def test_professional_prices_are_secondary_and_calculator_is_removed(self):
        page = (ROOT / "profesionales.html").read_text(encoding="utf-8")
        script = (ROOT / "profesionales.js").read_text(encoding="utf-8")
        styles = (ROOT / "profesionales.css").read_text(encoding="utf-8")
        self.assertRegex(page, r'<details[^>]*class="[^"]*pro-plan-disclosure')
        self.assertIn("propuesta de planes", page.lower())
        self.assertIn("beta es gratuita", page.lower())
        self.assertNotIn("Ver planes y precios", page)
        self.assertNotIn("pro-cost-", page + script + styles)
        self.assertNotIn("updateCostScenario", script)

    def test_feedback_page_is_user_controlled_mailto_without_persistence_or_network(self):
        page = (ROOT / "feedback-beta.html").read_text(encoding="utf-8")
        script = (ROOT / "feedback-beta.js").read_text(encoding="utf-8")
        self.assertIn("mailto:hola@cochemotor.es", page)
        self.assertIn("mailto:", script)
        self.assertIn("no guarda", page.lower())
        self.assertNotRegex(script, r"\b(fetch|XMLHttpRequest|localStorage|sessionStorage)\b")

    def test_feedback_link_appears_in_public_footers_and_professional_hub(self):
        pages = [
            "index.html", "privacidad.html", "marketplace.html", "dealer.html",
            "terminos.html", "aviso-legal.html", "ficha.html", "profesionales.html",
            "demo-profesional.html", "demanda.html",
        ]
        for name in pages:
            with self.subTest(page=name):
                page = (ROOT / name).read_text(encoding="utf-8")
                self.assertIn('href="feedback-beta.html', page)
        hub = (ROOT / "hub.html").read_text(encoding="utf-8")
        self.assertIn('href="feedback-beta.html', hub)

    def test_dark_footer_uses_approved_dark_background_logo(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        pro = (ROOT / "profesionales.html").read_text(encoding="utf-8")
        self.assertRegex(home, r'<footer[\s\S]*?cochemotor-final-dark\.png')
        self.assertRegex(pro, r'<footer[\s\S]*?cochemotor-final-dark\.png')
        self.assertTrue((ROOT / "assets/brand/logos/cochemotor-final-dark.png").is_file())


if __name__ == "__main__":
    unittest.main()
