import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class WebFlowReliabilityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.hub = (ROOT / "hub.html").read_text(encoding="utf-8")
        cls.hub_js = (ROOT / "hub.js").read_text(encoding="utf-8")
        cls.marketplace = (ROOT / "marketplace.html").read_text(encoding="utf-8")
        cls.ficha = (ROOT / "ficha.html").read_text(encoding="utf-8")
        cls.seo_page = (ROOT / "seo-public.php").read_text(encoding="utf-8")
        cls.lead_js = (ROOT / "assets/js/public-lead-form.js").read_text(encoding="utf-8")
        cls.access = (ROOT / "acceso.html").read_text(encoding="utf-8")
        cls.api = (ROOT / "api" / "index.php").read_text(encoding="utf-8")
        cls.site_config = (ROOT / "site-config.js").read_text(encoding="utf-8")
        cls.home_catalog = (ROOT / "assets/js/home_catalog.js").read_text(encoding="utf-8")
        cls.deploy = (ROOT / ".github/workflows/deploy-seo-hostinger.yml").read_text(encoding="utf-8")

    def test_panel_session_check_uses_the_api_bearer_contract(self):
        self.assertRegex(self.hub, r"headers\s*:\s*\{[^}]*['\"]Authorization['\"]\s*:\s*`Bearer \$\{session\.sessionToken\}`")
        self.assertNotRegex(self.hub, r"session_token\s*:\s*session\.sessionToken")

    def test_vehicle_api_write_uses_authorization_header_not_body_token(self):
        vehicle_request = self.hub_js.split("fetch('/api/vehicles'", 1)[1].split("});", 1)[0]
        self.assertIn("professionalAuthHeaders", vehicle_request)
        self.assertNotIn("session_token", vehicle_request)

    def test_marketplace_price_filter_initializer_is_defined(self):
        self.assertIn('src="site-config.js?', self.marketplace)
        self.assertRegex(self.site_config, r"function\s+populatePriceSearchSelect\s*\(")
        self.assertIn("populatePriceSearchSelect(document.getElementById('filter-price')", self.marketplace)
        self.assertIn("site-config.js", self.deploy)

    def test_contact_form_has_privacy_notice_and_request_to_be_contacted(self):
        form = self.seo_page.split('id="vehicle-contact-form"', 1)[1].split("</form>", 1)[0]
        self.assertRegex(form, r"type=['\"]checkbox['\"]")
        self.assertRegex(form, r"privacidad\.html")
        self.assertRegex(form, r"id=['\"]lead-contact-request['\"]")

    def test_contact_success_waits_for_server_and_preserves_form_on_failure(self):
        self.assertIn("await fetch('/api/leads'", self.lead_js)
        self.assertIn("!response.ok", self.lead_js)
        self.assertIn("Solicitud guardada", self.lead_js)
        self.assertIn("catch (error)", self.lead_js)
        self.assertIn("form.reset()", self.lead_js)
        self.assertIn("isDemo", self.ficha)

    def test_api_validates_contact_request_and_persisted_lead_shape(self):
        lead_post = self.api.split("if ($route==='/api/leads' && $method==='POST')", 1)[1].split("fail(404,'Ruta no encontrada')", 1)[0]
        for marker in ("contact_requested", "privacy_notice_version", "INTERVAL 10 MINUTE", "v.stage='publicado'", "v.status='disponible'", "preg_match"):
            self.assertIn(marker, lead_post)
        self.assertIn("contact_requested_at", lead_post)

    def test_registration_requires_privacy_acknowledgement_and_links_current_notices(self):
        form = self.access.split('id="register-form"', 1)[1].split("</form>", 1)[0]
        self.assertRegex(form, r'(?:/privacidad|privacidad\.html)')
        self.assertRegex(form, r'(?:/terminos|terminos\.html)')
        self.assertRegex(form, r"type=['\"]checkbox['\"]")
        self.assertIn("privacy_notice_version", self.api)

    def test_home_catalog_is_loaded_on_demand_not_as_initial_static_import(self):
        self.assertNotRegex(self.home_catalog, r"^import\s+\{[^}]+\}\s+from\s+['\"]\.\./data/vehicles_catalog\.js['\"]")
        self.assertRegex(self.home_catalog, r"import\(['\"]\.\./data/vehicles_catalog\.js\?v=[^'\"]+['\"]\)")

    def test_hostinger_release_covers_changed_runtime_assets_and_verifies_hashes(self):
        for asset in ("hub.js", "site-config.js", "acceso.html", "ficha.html", "marketplace.html", "assets/js/home_catalog.js", "assets/data/vehicles_catalog.js", "assets/js/public-lead-form.js", "007_lead_and_registration_notice_mysql.sql"):
            self.assertIn(asset, self.deploy)
        self.assertIn("sha256sum", self.deploy)
        self.assertIn("release=$GITHUB_SHA", self.deploy)


if __name__ == "__main__":
    unittest.main()
