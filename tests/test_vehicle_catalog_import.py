import argparse
import runpy
import sys
import unittest
from pathlib import Path
from datetime import date


ROOT = Path(__file__).resolve().parents[1]
IMPORTER = ROOT / 'scripts' / 'import_vehicle_catalog.py'


class VehicleCatalogImportTests(unittest.TestCase):
    def importer_namespace(self):
        sys.dont_write_bytecode = True
        return runpy.run_path(str(IMPORTER))

    def provenance_builder(self):
        return self.importer_namespace()['build_provenance']

    def test_missing_provenance_is_explicitly_unverified(self):
        metadata = self.provenance_builder()()
        self.assertEqual(metadata['sourceLabel'], 'unknown')
        self.assertIsNone(metadata['sourceDataAsOf'])
        self.assertIsNone(metadata['license'])
        self.assertEqual(metadata['provenanceStatus'], 'incomplete')

    def test_declared_provenance_keeps_source_date_separate(self):
        metadata = self.provenance_builder()(
            'Synthetic test source', 'https://example.org/data', date(2025, 12, 31), 'CC-BY-4.0'
        )
        self.assertEqual(metadata['sourceDataAsOf'], '2025-12-31')
        self.assertEqual(metadata['license'], 'CC-BY-4.0')
        self.assertEqual(metadata['provenanceStatus'], 'declared-not-verified')
        self.assertRegex(metadata['generatedAt'], r'^\d{4}-\d{2}-\d{2}$')

    def test_source_url_requires_https(self):
        validate_url = self.importer_namespace()['https_url']
        with self.assertRaises(argparse.ArgumentTypeError):
            validate_url('http://example.org/data')


if __name__ == '__main__':
    unittest.main()
