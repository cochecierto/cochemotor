import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class CocheIdealNeedCategoryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ROOT / "demanda.html").read_text(encoding="utf-8")
        cls.js = (ROOT / "demanda.js").read_text(encoding="utf-8")
        cls.php = (ROOT / "api" / "index.php").read_text(encoding="utf-8")
        cls.python = (ROOT / "local-broker" / "server.py").read_text(encoding="utf-8")

    def test_need_is_the_entry_point_and_vehicle_identity_is_optional(self):
        self.assertLess(self.html.index("¿Para qué lo necesitas?"), self.html.index('id="ci-brand"'))
        self.assertIn("¿Tienes una marca en mente?", self.html)
        self.assertNotIn('id="ci-brand" required', self.html)
        self.assertNotIn("if (!brand.value)", self.js)

    def test_family_city_and_work_have_bounded_category_suggestions(self):
        self.assertIn("family: { label: 'Familia y espacio', categories: ['family', 'minivan', 'suv'] }", self.js)
        self.assertIn("city: { label: 'Moverme por ciudad', categories: ['urban'] }", self.js)
        self.assertIn("work: { label: 'Trabajo y carga', categories: ['van', 'pickup'] }", self.js)
        self.assertIn("'family' => ['family', 'minivan', 'suv']", self.php)
        self.assertIn('"family": {"family", "minivan", "suv"}', self.python)
        self.assertIn("array_diff($matchedCategories, $needCategoryMap[$needId] ?? [])", self.php)

    def test_request_persists_explicit_need_and_rules_strategy(self):
        for field in ("need:", "matchedCategories,", "matchingStrategy: 'rules-v1'"):
            self.assertIn(field, self.js)
        self.assertIn("'matchedCategories' => array_values($matchedCategories)", self.php)
        self.assertIn('payload["preferences"].get("matchingStrategy") != "rules-v1"', self.python)
        self.assertIn("No existe integración LLM", (ROOT / "docs" / "CURRENT-STATE.md").read_text(encoding="utf-8"))

    def test_category_cards_load_optimized_user_supplied_assets(self):
        images = sorted((ROOT / "assets" / "images" / "coche-ideal" / "categories").glob("*.webp"))
        self.assertEqual(len(images), 12)
        self.assertIn("loading = 'lazy'", self.js)
        self.assertIn("assets/images/coche-ideal/categories/${category.image}", self.js)
        self.assertLess(sum(image.stat().st_size for image in images), 500_000)
        for image in images:
            self.assertEqual(image.read_bytes()[8:12], b"WEBP", image.name)

    def test_hero_uses_optimistic_key_handover_image_with_clear_disclaimer(self):
        image = ROOT / "assets" / "images" / "coche-ideal" / "entrega-llaves.webp"
        self.assertTrue(image.is_file())
        self.assertLess(image.stat().st_size, 150_000)
        self.assertIn("entrega-llaves.webp", self.html)
        self.assertIn("compradora recibe las llaves", self.html)
        self.assertIn("No representa una oferta real ni garantiza la disponibilidad", self.html)

    def test_contact_preferences_review_and_consent_are_present_and_server_validated(self):
        for channel in ("email", "whatsapp", "call"):
            self.assertIn(f'value="{channel}"', self.html)
        self.assertIn('data-step="4"', self.html)
        self.assertIn('id="demand-summary"', self.html)
        self.assertIn("coche-ideal-v4", self.js)
        self.assertIn("$validChannels", self.php)
        self.assertIn("$validSchedule", self.php)
        self.assertIn("'channels' => array_values($channels)", self.php)
        self.assertIn("allowed_channels", self.python)
        self.assertIn("payload[\"consent\"].get(\"contact\") is not True", self.python)

    def test_review_shows_preferred_category_image_and_quieter_privacy_note(self):
        self.assertIn("demand-summary-featured", self.js)
        self.assertIn("function preferredCategoryId()", self.js)
        self.assertIn("elegida como preferente", self.js)
        self.assertIn(".demand-summary-private > p", (ROOT / "demanda.css").read_text(encoding="utf-8"))

    def test_live_search_card_uses_generic_then_preferred_vehicle_image(self):
        self.assertIn('id="preview-vehicle-image"', self.html)
        self.assertIn('src="assets/images/coche-ideal-placeholder.svg"', self.html)
        self.assertIn("previewImage.src = preferredCategory", self.js)
        self.assertIn("function preferredCategoryId()", self.js)
        self.assertIn("assets/images/coche-ideal/categories/${preferredCategory.image}", self.js)
        self.assertIn("function updateCategoryBadges()", self.js)
        self.assertIn("También encaja", self.js)
        self.assertIn(".demand-preview-type", (ROOT / "demanda.css").read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
