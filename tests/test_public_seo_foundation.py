import re
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class PublicSeoFoundationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.api = (ROOT / "api" / "index.php").read_text(encoding="utf-8")
        cls.page = (ROOT / "seo-public.php").read_text(encoding="utf-8")
        cls.sitemap = (ROOT / "sitemap-public.php").read_text(encoding="utf-8")
        cls.migration = (ROOT / "database" / "migrations" / "004_public_seo_profiles_mysql.sql").read_text(encoding="utf-8")
        cls.moderation_migration = (ROOT / "database" / "migrations" / "005_publication_moderation_mysql.sql").read_text(encoding="utf-8")
        cls.slug_migration = (ROOT / "database" / "migrations" / "006_unique_public_vehicle_slugs_mysql.sql").read_text(encoding="utf-8")
        cls.profile = (ROOT / "perfil.html").read_text(encoding="utf-8")

    def test_profiles_are_private_by_default_and_need_explicit_consent(self):
        self.assertRegex(self.migration, r"public_profile\s+TINYINT\(1\)\s+NOT NULL DEFAULT 0")
        self.assertIn("public_profile_consent_version", self.migration)
        self.assertIn("public_profile_consent_at", self.migration)
        self.assertIn("public_profile_consent", self.api)
        self.assertIn("Verifica tu correo antes de publicar el perfil", self.api)
        self.assertIn("profile-public-optin", self.profile)
        self.assertIn("Mi correo y teléfono no se publicarán", self.profile)

    def test_vehicle_page_requires_published_verified_contact_and_verified_account(self):
        self.assertIn("v.status='disponible' AND v.stage='publicado' AND u.email_verified=1", self.page)
        self.assertIn("pc.contact_verified=1", self.page)
        self.assertIn("X-Robots-Tag: noindex, nofollow", self.page)
        self.assertIn("'@type'=>['Product','Car']", self.page)
        self.assertIn("itemCondition'=>'https://schema.org/UsedCondition'", self.page)
        self.assertIn("Vehículo de ocasión · Anuncio publicado por un profesional", self.page)

    def test_vehicle_public_slugs_are_validated_and_unique(self):
        self.assertIn("ADD UNIQUE KEY uq_vehicles_public_slug (public_slug)", self.slug_migration)
        self.assertIn("if(!preg_match('/^[a-z0-9][a-z0-9-]{2,179}$/',$slug))fail(400", self.api)
        self.assertIn("http_response_code(404)", self.page)

    def test_vehicle_without_real_uploaded_photo_is_not_indexed_or_in_sitemap(self):
        self.assertIn("$indexable=count($images)>0", self.page)
        self.assertIn("if(!$indexable)header('X-Robots-Tag: noindex, follow')", self.page)
        self.assertIn("vi.image_url REGEXP '^uploads/vehicles/[a-f0-9]{40}[.]webp$'", self.sitemap)

    def test_profile_page_needs_consent_and_complete_description(self):
        self.assertIn("d.public_profile=1", self.page)
        self.assertIn("d.public_profile_consent_version='public-profile-v1'", self.page)
        self.assertIn("CHAR_LENGTH(TRIM(COALESCE(d.public_description,'')))>=80", self.page)
        self.assertIn("$eligibleIndexable", self.page)
        self.assertIn("vi.image_url REGEXP '^uploads/vehicles/[a-f0-9]{40}[.]webp$'", self.page)
        self.assertIn("AS image_path", self.page)
        self.assertIn('class="seo-car-photo"', self.page)
        self.assertIn('loading="lazy"', self.page)
        self.assertIn("d.public_profile=1", self.sitemap)
        self.assertIn("vi.image_url REGEXP '^uploads/vehicles/[a-f0-9]{40}[.]webp$'", self.sitemap)

    def test_public_api_does_not_return_private_contact_fields(self):
        match = re.search(r"\$items\[\]=\[(.*?)\];", self.api, re.S)
        self.assertIsNotNone(match)
        public_payload = match.group(1)
        for private_field in ("email", "phone", "password", "verification_token"):
            self.assertNotIn("'" + private_field + "'", public_payload)
        self.assertIn("/api/public/vehicles", self.api)

    def test_moderation_is_disabled_without_secret_and_audits_explicit_decisions(self):
        self.assertIn("COCHEMOTOR_MODERATION_TOKEN", self.api)
        self.assertIn("strlen($secret)<32", self.api)
        self.assertIn("hash_equals($secret,token())", self.api)
        self.assertIn("COCHEMOTOR_MODERATION_ACTOR", self.api)
        self.assertIn("/api/moderation/vehicles", self.api)
        self.assertIn("['approve','unpublish']", self.api)
        self.assertIn("if(!$contact->fetchColumn())", self.api)
        self.assertIn("WHERE vehicle_id=? AND contact_id=?", self.api)
        self.assertIn("u.email_verified", self.api)
        self.assertIn("vehicle_moderation_history", self.api)
        self.assertIn("contact_verified_at", self.moderation_migration)
        self.assertIn("fk_vehicle_moderation_history_vehicle", self.moderation_migration)

    def test_legacy_client_side_fixtures_are_noindex(self):
        for filename in ("ficha.html", "dealer.html", "perfil.html"):
            html = (ROOT / filename).read_text(encoding="utf-8")
            self.assertRegex(html, r'<meta name="robots" content="noindex,(?:follow|nofollow)">')

    def test_public_routes_share_canonical_and_sitemap_sources(self):
        rules = (ROOT / ".htaccess").read_text(encoding="utf-8")
        self.assertIn("^vehiculos/", rules)
        self.assertIn("^profesionales/", rules)
        self.assertIn("^sitemap\\.xml$ sitemap-public.php", rules)
        self.assertIn("rel=\"canonical\"", self.page)
        self.assertIn("BreadcrumbList", self.page)
        self.assertIn("'@type'=>['Product','Car']", self.page)
        redirects = (ROOT / "seo-legacy-redirect.php").read_text(encoding="utf-8")
        self.assertIn("true,301", redirects)
        self.assertIn("X-Robots-Tag: noindex, follow", redirects)

    def test_hosting_rules_block_repository_and_development_artifacts(self):
        rules = (ROOT / ".htaccess").read_text(encoding="utf-8")
        self.assertIn("RewriteRule ^\\.git", rules)
        self.assertRegex(rules, r"\(zip\|py\|bat\|sh\|md\|log\|db\|sqlite\|sqlite3\|sql\)")
        self.assertIn("deploy_hostinger\\.py", rules)

    def test_seo_deployment_is_manual_gated_and_scoped_to_public_assets(self):
        workflow = (ROOT / ".github" / "workflows" / "deploy-seo-hostinger.yml").read_text(encoding="utf-8")
        self.assertIn("workflow_dispatch:", workflow)
        self.assertIn("seo_backup_ready", workflow)
        self.assertIn("seo_migrations_ready", workflow)
        self.assertIn("SEO_BACKUP_READY", workflow)
        backup_guard = workflow.index('if [[ "$SEO_BACKUP_READY" != "true" ]]')
        migration_guard = workflow.index('if [[ "$SEO_MIGRATIONS_READY" != "true" ]]')
        secret_setup = workflow.index("name: Validar secretos y host key SFTP")
        upload = workflow.index("name: Subir a staging y promover solo archivos SEO permitidos")
        self.assertLess(backup_guard, secret_setup)
        self.assertLess(migration_guard, secret_setup)
        self.assertLess(secret_setup, upload)
        self.assertIn("if: github.event_name == 'workflow_dispatch'", workflow)
        self.assertIn("StrictHostKeyChecking=yes", workflow)
        self.assertIn("put seo-public.php", workflow)
        self.assertIn("put sitemap-public.php", workflow)
        self.assertIn("put guias/comprar-coche-usado.html", workflow)
        self.assertIn("rename $stage/.htaccess .htaccess", workflow)
        self.assertIn("Google necesita leer noindex", workflow)
        self.assertIn("/asesor-leads.html", workflow)
        self.assertNotIn("--delete", workflow)
        self.assertNotIn("put database/", workflow)

    def test_production_migration_runbook_is_guarded_for_existing_hostinger_database(self):
        runbook = (ROOT / "database" / "README.md").read_text(encoding="utf-8")
        self.assertIn("no volver a ejecutar 001–003", runbook)
        self.assertIn("004 no es idempotente", runbook)
        self.assertIn("HAVING COUNT(*) > 1", runbook)
        self.assertIn("La casilla del workflow", runbook)
        self.assertIn("no contar con que un `ROLLBACK` revierta", runbook)

    def test_static_sitemap_only_lists_canonical_entry_pages(self):
        sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
        for filename in ("marketplace.html", "demanda.html", "profesionales.html", "guias/comprar-coche-usado.html", "aviso-legal.html", "privacidad.html", "terminos.html"):
            page = (ROOT / filename).read_text(encoding="utf-8")
            self.assertIn("https://cochemotor.es/" + filename, sitemap)
            self.assertIn('rel="canonical" href="https://cochemotor.es/' + filename + '"', page)
        self.assertNotIn("publicar.html", sitemap)
        self.assertRegex((ROOT / "publicar.html").read_text(encoding="utf-8"), r'<meta name="robots" content="noindex,follow">')

    def test_private_flows_are_crawlable_for_noindex_and_excluded_from_sitemap(self):
        robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
        sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
        for filename in ("acceso.html", "hub.html", "asesor.html", "asesor-leads.html"):
            html = (ROOT / filename).read_text(encoding="utf-8")
            self.assertRegex(html, r'<meta name="robots" content="noindex,follow">')
            self.assertNotIn("https://cochemotor.es/" + filename, sitemap)
            self.assertNotIn("Disallow: /" + filename, robots)
        self.assertIn("Disallow: /api/", robots)

    def test_editorial_page_links_to_official_sources_and_sitemap(self):
        guide = (ROOT / "guias" / "comprar-coche-usado.html").read_text(encoding="utf-8")
        self.assertIn("rel=\"canonical\"", guide)
        self.assertIn("https://www.dgt.es/", guide)
        self.assertIn("comprar-un-vehiculo-de-segunda-mano", guide)
        self.assertIn("comprar-coche-usado.html", self.sitemap)
        jsonld = re.search(r'<script type="application/ld\+json">(.*?)</script>', guide, re.S)
        self.assertIsNotNone(jsonld)
        graph = json.loads(jsonld.group(1))["@graph"]
        self.assertEqual({item["@type"] for item in graph}, {"Article", "BreadcrumbList"})
        self.assertIn('aria-current="page"', guide)
        self.assertIn('href="../demanda.html"', guide)
        self.assertIn("No te compromete a comprar", guide)

    def test_buying_guide_covers_dgt_report_contract_tax_and_transfer(self):
        guide = (ROOT / "guias" / "comprar-coche-usado.html").read_text(encoding="utf-8")
        for phrase in ("informe reducido", "es gratuito", "informe completo", "contrato", "modelos 620/621", "30 días", "Sede Electrónica de la DGT"):
            self.assertIn(phrase, guide)

    def test_measurement_plan_does_not_attribute_site_conversions_to_search_console(self):
        operations = (ROOT / "docs" / "knowledge" / "SEO-OPERATIONS.md").read_text(encoding="utf-8")
        self.assertIn("no mide conversiones dentro de la web", operations)
        self.assertIn("Conversión SEO: **pendiente de medición**", operations)
        self.assertIn("no está integrada en las páginas SEO", operations)
        self.assertIn("No conectarla a las fichas SEO", operations)
        self.assertIn("AEPD", operations)

    def test_homepage_brand_markup_uses_supported_entity_types(self):
        homepage = (ROOT / "index.html").read_text(encoding="utf-8")
        block = re.search(r'<script type="application/ld\+json">(.*?)</script>', homepage, re.S)
        self.assertIsNotNone(block)
        graph = json.loads(block.group(1))["@graph"]
        self.assertEqual({item["@type"] for item in graph}, {"Organization", "WebSite"})
        self.assertNotIn("SearchAction", block.group(1))


if __name__ == "__main__":
    unittest.main()
