import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class BetaTrustTests(unittest.TestCase):
    def test_public_catalog_never_uses_demo_fixtures_as_fallback(self):
        app = (ROOT / "app.js").read_text(encoding="utf-8")
        marketplace = (ROOT / "marketplace.html").read_text(encoding="utf-8")
        self.assertIn("fetch('/api/public/vehicles'", app)
        self.assertNotIn("CocheMotorStorage.getStock()", app)
        self.assertIn("vehicle.isDemo !== true", marketplace)
        self.assertIn("vehicle.publicationState !== 'proxima_entrada'", marketplace)
        self.assertIn("catalogStatus === 'unavailable'", marketplace)
        self.assertIn("Todavía no hay vehículos reales publicados", marketplace)
        ficha = (ROOT / "ficha.html").read_text(encoding="utf-8")
        self.assertIn("currentCar = null", ficha)
        self.assertIn("list[0].status === 'disponible'", ficha)

    def test_price_bands_cover_boundaries_without_gaps(self):
        config = (ROOT / "site-config.js").read_text(encoding="utf-8")
        self.assertIn('{ value: "5000", label: "Hasta 5.000 €" }', config)
        for band in ("5000-10000", "10000-15000", "15000-20000", "20000-25000"):
            self.assertIn(band, config)
        self.assertIn('if (range === "over25000") return amount > 25000;', config)
        self.assertIn('amount > Number(band[1]) && amount <= Number(band[2])', config)

    def test_beta_intake_and_writes_are_disabled_in_ui_and_api(self):
        access = (ROOT / "acceso.html").read_text(encoding="utf-8")
        api = (ROOT / "api" / "index.php").read_text(encoding="utf-8")
        self.assertIn('id="register-form" hidden', access)
        for route in ("/api/coche-ideal", "/api/vehicles", "/api/leads"):
            self.assertIn(route, api)
        self.assertIn("El alta de cuentas reales está desactivada", access)

    def test_demo_is_ephemeral_and_finance_margin_assumptions_are_explicit(self):
        page = (ROOT / "demo-profesional.html").read_text(encoding="utf-8")
        script = (ROOT / "demo-profesional.js").read_text(encoding="utf-8")
        self.assertIn('value="7.9"', page)
        self.assertIn("No es TAE", page)
        self.assertIn("se descartan al recargar", page)
        self.assertIn("URL.revokeObjectURL", script)
        self.assertIn("no es margen neto", script)
        self.assertNotRegex(script, r"localStorage|sessionStorage|indexedDB|fetch\s*\(")

    def test_vehicle_sheet_finance_uses_editable_tin_not_tae(self):
        page = (ROOT / "ficha.html").read_text(encoding="utf-8")
        self.assertIn('id="calc-tin"', page)
        self.assertIn('value="7.9"', page)
        self.assertIn("const r = annualTin / 1200", page)
        self.assertIn("no es TAE ni oferta", page)
        self.assertNotIn("TAE 7.95%", page)

    def test_home_filtered_empty_state_is_different_from_empty_catalog(self):
        app = (ROOT / "app.js").read_text(encoding="utf-8")
        self.assertIn("Ningún vehículo coincide con este filtro", app)
        self.assertIn("Todavía no hay vehículos reales publicados", app)
        self.assertIn("Restablecer filtros", app)
        self.assertIn("var allStock = Array.isArray(data.vehicles)", app)
        self.assertNotIn("function initStockFilters()", app)


if __name__ == "__main__":
    unittest.main()
