from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
API = (ROOT / 'api' / 'index.php').read_text(encoding='utf-8')
UI = (ROOT / 'acceso.html').read_text(encoding='utf-8')
CSS = (ROOT / 'styles.css').read_text(encoding='utf-8')
MIGRATION = (ROOT / 'database' / 'migrations' / '009_oauth_social_identities_mysql.sql').read_text(encoding='utf-8')

class TestOAuthSocialArchitecture(unittest.TestCase):
    def test_database_migration_allows_null_password_and_defines_identities_table(self):
        self.assertIn('ALTER TABLE professional_users MODIFY password_hash VARCHAR(255) NULL', MIGRATION)
        self.assertIn('CREATE TABLE IF NOT EXISTS oauth_identities', MIGRATION)
        self.assertIn('provider_user_id', MIGRATION)
        self.assertIn('uq_provider_uid', MIGRATION)

    def test_beta_access_ui_does_not_collect_account_credentials(self):
        self.assertNotIn('<form', UI)
        self.assertNotIn('oauth-google', UI)
        self.assertNotIn('Continuar con Google', UI)
        self.assertNotIn('session_token', UI)
        self.assertNotIn('localStorage', UI)
        self.assertIn('beta informativa', UI)

    def test_css_includes_social_button_styling(self):
        self.assertIn('.btn-social', CSS)
        self.assertIn('.btn-google', CSS)
        self.assertIn('.btn-apple', CSS)
        self.assertIn('.btn-facebook', CSS)
        self.assertIn('.auth-divider', CSS)

    def test_api_defines_oauth_and_callback_endpoints(self):
        self.assertIn('/api/auth/oauth/(google|apple|facebook)', API)
        self.assertIn('/api/auth/callback/(google|apple|facebook)', API)
        self.assertIn('oauthConfig', API)
        self.assertIn('GOOGLE_CLIENT_ID', API)
        self.assertIn('oauth_identities', API)

if __name__ == '__main__':
    unittest.main()
