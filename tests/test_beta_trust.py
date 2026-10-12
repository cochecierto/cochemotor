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
        self.assertNotIn("<form", access)
        self.assertNotIn("api-config.js", access)
        self.assertNotIn("localStorage", access)
        self.assertNotIn("/api/auth", access)
        self.assertIn('class="beta-access-notice"', access)
        self.assertIn("No introduzcas datos personales", access)
        for route in ("/api/coche-ideal", "/api/vehicles", "/api/leads"):
            self.assertIn(route, api)
        self.assertIn("El acceso y la gestión de cuentas están desactivados", api)

    def test_disabled_writes_are_rejected_before_config_or_request_body_read(self):
        api = (ROOT / "api" / "index.php").read_text(encoding="utf-8")
        write_guard = api.index("if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true))")
        private_config = api.index("$privateConfigCandidates = [")
        body_reader = api.index("$data=str_starts_with($contentType")
        self.assertLess(write_guard, private_config)
        self.assertLess(write_guard, body_reader)

    def test_public_beta_write_guards_precede_database_inserts(self):
        api = (ROOT / "api" / "index.php").read_text(encoding="utf-8")
        guarded_writes = (
            ("if ($method === 'POST' && $route === '/api/coche-ideal') fail(403,", "INSERT INTO coche_ideal_requests"),
            ("if ($route === '/api/vehicles' && in_array($method, ['POST', 'PATCH'], true)) fail(403,", "INSERT INTO vehicles("),
            ("if ($method === 'POST' && $route === '/api/report') fail(403,", "INSERT INTO ad_reports"),
            ("if ($action==='register') {", "INSERT INTO professional_users("),
            ("if ($route==='/api/leads' && $method==='POST') {", "INSERT INTO leads("),
        )
        for guard, insert in guarded_writes:
            with self.subTest(route=guard):
                guard_index = api.find(guard)
                self.assertGreaterEqual(guard_index, 0, f"Missing write guard: {guard}")
                if guard.endswith("{"):
                    guard_index = api.find("fail(403,", guard_index)
                    self.assertGreaterEqual(guard_index, 0, f"Missing 403 inside: {guard}")
                insert_index = api.find(insert, guard_index)
                self.assertGreater(insert_index, guard_index, f"Database write precedes guard: {insert}")

    def test_login_report_and_private_reads_are_closed_without_database_access(self):
        api = (ROOT / "api" / "index.php").read_text(encoding="utf-8")
        routes = api.index("$path=parse_url")
        auth_guard = api.index("if ($route === '/api/auth' || str_starts_with($route, '/api/auth/'))", routes)
        generic_write_guard = api.index("if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true))", routes)
        private_guard = api.index("function requireUser(): array")
        for marker in ("if ($action==='login')", "INSERT INTO ad_reports"):
            self.assertGreater(api.find(marker), auth_guard)
        self.assertGreater(generic_write_guard, auth_guard)
        private_handler = api[private_guard:api.index("function requireModerator", private_guard)]
        self.assertIn("fail(403,", private_handler)
        self.assertNotIn("user();", private_handler)

    def test_oauth_callback_is_blocked_before_provider_or_database_access(self):
        api = (ROOT / "api" / "index.php").read_text(encoding="utf-8")
        callback_index = api.index("callback/(google|apple|facebook)")
        callback_start = api.rfind("if (preg_match(", 0, callback_index)
        callback_end = api.index("$err =", callback_index)
        callback_block = api[callback_start:callback_end]
        self.assertIn("fail(403,", callback_block)
        self.assertLess(callback_block.index("fail(403,"), callback_block.index("$provider = $matches[1]"))
        self.assertNotIn("curl_init(", callback_block)
        self.assertNotIn("db()", callback_block)

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


    def test_home_hides_search_controls_when_catalog_api_is_unavailable(self):
        app = (ROOT / "app.js").read_text(encoding="utf-8")
        config = (ROOT / "site-config.js").read_text(encoding="utf-8")
        unavailable = app.split("function renderStockUnavailable()", 1)[1].split("function renderStockGrid", 1)[0]
        self.assertIn(".hero-search-box", unavailable)
        self.assertIn(".catalog-filters", unavailable)
        self.assertIn("no pudimos consultar el inventario real", unavailable.lower())
        self.assertIn("updateHomeCatalogState('unavailable')", unavailable)
        self.assertIn("No podemos confirmar si hay anuncios disponibles", app)
        self.assertIn("Consulta el estado del catálogo real.", config)
        self.assertNotIn("El catálogo aún no tiene stock real", config)

    def test_empty_catalog_controls_remain_hidden_after_loading_site_styles(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        styles = (ROOT / "styles.css").read_text(encoding="utf-8")
        self.assertIn('styles.css?v=20261012.1', home)
        self.assertIn('[hidden] { display: none !important; }', styles)
        self.assertIn('.catalog-filters[hidden]', styles)
        self.assertIn('.hero-search-box[hidden]', styles)

    def test_production_release_deploys_homepage_script_and_serializes_api_writes(self):
        seo = (ROOT / ".github" / "workflows" / "deploy-seo-hostinger.yml").read_text(encoding="utf-8")
        demo = (ROOT / ".github" / "workflows" / "deploy-hostinger.yml").read_text(encoding="utf-8")
        self.assertIn('"app.js"', seo)
        self.assertIn("put app.js $stage/app.js", seo)
        self.assertIn("scripts/hostinger-release-transaction.sh", seo)
        self.assertRegex(seo, r"assets=\([^\n]*app\.js")
        self.assertIn("seo_no_ddl:", seo)
        self.assertNotIn("seo_migrations_ready:", seo)
        self.assertIn("no aplica migraciones ni DDL", seo)
        self.assertIn("group: cochemotor-hostinger-production", seo)
        self.assertNotIn("workflow_dispatch:", demo)
        self.assertNotIn("sftp -b -", demo)
        self.assertIn("promote.sh' rollback", seo)
        self.assertIn("rollback_on_exit", seo)

if __name__ == "__main__":
    unittest.main()
