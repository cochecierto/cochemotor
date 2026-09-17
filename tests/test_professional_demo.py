import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ProfessionalDemoTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.page = (ROOT / "demo-profesional.html").read_text(encoding="utf-8")
        cls.script = (ROOT / "demo-profesional.js").read_text(encoding="utf-8")
        cls.styles = (ROOT / "demo-profesional.css").read_text(encoding="utf-8")
        cls.landing = (ROOT / "profesionales.html").read_text(encoding="utf-8")
        cls.workflow = (ROOT / ".github/workflows/deploy-hostinger.yml").read_text(encoding="utf-8")

    def test_demo_is_publicly_linked_but_not_indexed(self):
        self.assertIn('href="demo-profesional.html"', self.landing)
        self.assertRegex(self.page, r'<meta\s+name="robots"\s+content="noindex,\s*follow"')
        self.assertIn('assets/brand/logos/cochemotor-horizontal-light.png', self.page)

    def test_demo_routes_only_to_beta_registration_or_professional_landing(self):
        self.assertIn("/acceso?audience=professional&amp;return=hub&amp;mode=register", self.page)
        self.assertRegex(self.page, r'href="(?:/)?profesionales(?:\.html)?"')
        self.assertNotRegex(self.page, r'href="https?://')
        self.assertNotRegex(self.page, r'href="(?:hub|dealer|ficha)\.html')

    def test_demo_does_not_use_network_persistence_or_external_action_apis(self):
        forbidden = re.compile(
            r"\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|"
            r"indexedDB|navigator\.clipboard|window\.open|window\.print|\.submit\s*\(",
            re.IGNORECASE,
        )
        for source in (self.page, self.script):
            self.assertIsNone(forbidden.search(source))
        self.assertNotRegex(self.page, r"<form\b")

    def test_demo_has_synthetic_disclaimer_and_interactive_sections(self):
        self.assertIn("datos sintéticos", self.page.lower())
        for view in ("overview", "inventory", "contacts", "publish"):
            self.assertIn(f'data-view="{view}"', self.page)
            self.assertIn(f'id="view-{view}"', self.page)
        self.assertIn('data-view="generator" data-panel="tools"', self.page)
        self.assertIn('data-view="calculator" data-panel="tools"', self.page)
        self.assertIn("demoLeadStatus", self.script)
        self.assertIn("data-demo-filter", self.script)
        self.assertIn("data-demo-preview", self.page)

    def test_demo_exposes_real_hub_modules_and_marks_unimplemented_previews(self):
        labels = (
            "Añadir coche", "Seguimiento de contactos", "Generador con IA",
            "Copiloto de Precios", "Solicitudes de compradores", "Cuotas y margen",
            "Cartel Parabrisas QR", "Documentación de operaciones",
            "Publicar en redes y grupos", "Garantías y seguimiento posventa",
            "Afiliados B2B", "Mi página profesional",
        )
        for label in labels:
            self.assertIn(label, self.page)
        self.assertIn("No conectada en la demo", self.page)
        self.assertIn("modulePreviews", self.script)
        self.assertIn("no se consultan anuncios ni datos de mercado en directo", self.script)
        self.assertIn("no se conecta a redes sociales", self.script)
        self.assertIn("Esta vista no utiliza IA ni ofrece financiación", self.page)
        self.assertIn("id=\"demo-margin-output\"", self.page)
        self.assertIn("function updateMargin()", self.script)

    def test_demo_uses_readable_font_scale_and_scrollable_module_navigation(self):
        self.assertIn(".demo-nav-item { font-size: .9rem;", self.styles)
        self.assertIn(".demo-safety-note p, .demo-intro > div > p:last-child { font-size: .95rem;", self.styles)
        self.assertIn("max-height: min(68vh, 690px); overflow-y: auto", self.styles)

    def test_demo_sidebar_width_and_action_text_contrast_are_explicit(self):
        self.assertIn("grid-template-columns: 300px minmax(0, 1fr)", self.styles)
        self.assertIn("grid-template-columns: 1fr", self.styles)
        self.assertIn(".cm-demo-page a.demo-primary-button, .cm-demo-page a.demo-primary-button:visited", self.styles)
        self.assertIn("color: #fff", self.styles)

    def test_interactive_controls_are_explicit_buttons(self):
        self.assertIsNone(re.search(r'<button(?![^>]*\btype=)', self.page, re.IGNORECASE))

    def test_mobile_navigation_focus_and_reduced_motion_rules_exist(self):
        self.assertIn("@media (max-width: 760px)", self.styles)
        self.assertIn("@media (max-width: 420px)", self.styles)
        self.assertIn("grid-template-columns: 1fr", self.styles)
        self.assertIn("overflow-x: auto", self.styles)
        self.assertIn("prefers-reduced-motion: reduce", self.styles)
        self.assertIn(":focus-visible", self.styles)

    def test_production_deploy_is_manual_scoped_and_uses_pinned_sftp_trust(self):
        workflow = self.workflow
        self.assertIn("workflow_dispatch:", workflow)
        self.assertIn("if: github.event_name == 'workflow_dispatch'", workflow)
        self.assertIn("needs: validate", workflow)
        self.assertIn("sftp -b - -P 65002", workflow)
        self.assertIn("StrictHostKeyChecking=yes", workflow)
        self.assertIn("ssh-keygen -F", workflow)
        self.assertIn("HOSTINGER_SSH_PRIVATE_KEY", workflow)
        self.assertIn("HOSTINGER_SSH_KNOWN_HOSTS", workflow)
        self.assertIn("demo-profesional.html", workflow)
        self.assertIn("demo-profesional.css", workflow)
        self.assertIn("demo-profesional.js", workflow)
        self.assertIn("profesionales.html", workflow)
        self.assertIn("profesionales.css", workflow)
        self.assertNotIn("FTP-Deploy-Action", workflow)
        self.assertNotIn("--delete", workflow)
        self.assertNotIn("rm -rf", workflow)


if __name__ == "__main__":
    unittest.main()
