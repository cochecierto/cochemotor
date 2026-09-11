"""Pruebas del dominio automotriz de VendoCoche360 (Spec 001 SDD)."""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[1]))

from broker_core.domain import (  # noqa: E402
    Case,
    CaseState,
    Dealership,
    DgtBadge,
    TenantIsolationError,
    Vehicle,
    VehicleStatus,
    create_buyer_demand,
    create_case,
    create_demo_dealership,
    create_vehicle,
    generate_whatsapp_vehicle_link,
    get_case,
    get_vehicle,
    match_vehicles_for_demand,
    transition_case,
    verify_spanish_legal_milestones,
)


class AutomotiveDomainTests(unittest.TestCase):
    def setUp(self) -> None:
        self.dealer = create_demo_dealership(
            display_name="Autos Ocasión Demo España",
            tenant_id="tenant-autos-demo-es",
            dealer_slug="autos-demo-es",
            phone_whatsapp="34612345678",
        )

    def test_demo_dealership_identity(self) -> None:
        self.assertEqual(self.dealer.display_name, "Autos Ocasión Demo España")
        self.assertEqual(self.dealer.tenant_id, "tenant-autos-demo-es")
        self.assertEqual(self.dealer.dealer_slug, "autos-demo-es")
        self.assertEqual(self.dealer.phone_whatsapp, "34612345678")

    def test_register_vehicle_with_dgt_badge_and_specs(self) -> None:
        car = create_vehicle(
            dealership=self.dealer,
            brand="Volkswagen",
            model="Golf",
            version="2.0 TDI Advance",
            year=2020,
            mileage_km=68000,
            cash_price=16900.0,
            dgt_badge=DgtBadge.C,
        )

        self.assertEqual(car.tenant_id, self.dealer.tenant_id)
        self.assertEqual(car.brand, "Volkswagen")
        self.assertEqual(car.dgt_badge, DgtBadge.C)
        self.assertEqual(car.status, VehicleStatus.AVAILABLE)
        self.assertTrue(car.public_slug.startswith("volkswagen-golf-2020-"))

    def test_strict_multi_tenant_vehicle_isolation(self) -> None:
        car = create_vehicle(
            dealership=self.dealer,
            brand="Toyota",
            model="Yaris",
            version="Hybrid Active",
            year=2021,
            mileage_km=35000,
            cash_price=15500.0,
            dgt_badge=DgtBadge.ECO,
        )
        other_dealer = create_demo_dealership(
            display_name="Otro Concesionario",
            tenant_id="tenant-otro-compraventa",
            dealer_slug="otro-compraventa",
        )

        with self.assertRaises(TenantIsolationError):
            get_vehicle(car, other_dealer.tenant_id)

        # Debe pasar si el tenant coincide
        valid_car = get_vehicle(car, self.dealer.tenant_id)
        self.assertEqual(valid_car.vehicle_id, car.vehicle_id)

    def test_generate_public_whatsapp_link(self) -> None:
        car = create_vehicle(
            dealership=self.dealer,
            brand="Peugeot",
            model="3008",
            version="1.5 BlueHDi Allure",
            year=2021,
            mileage_km=52000,
            cash_price=18900.0,
            dgt_badge=DgtBadge.C,
        )
        wa_link = generate_whatsapp_vehicle_link(self.dealer, car)

        self.assertTrue(wa_link.startswith("https://wa.me/34612345678?text="))
        self.assertIn("Peugeot", wa_link)
        self.assertIn("3008", wa_link)
        self.assertIn("18%2C900", wa_link)

    def test_matching_demand_with_vehicle_stock(self) -> None:
        car_golf = create_vehicle(
            self.dealer, "VW", "Golf", "TDI", 2019, 90000, 14000.0, DgtBadge.C
        )
        car_yaris = create_vehicle(
            self.dealer, "Toyota", "Yaris", "Hybrid", 2021, 30000, 16000.0, DgtBadge.ECO
        )
        car_bmw = create_vehicle(
            self.dealer, "BMW", "Serie 3", "320d", 2022, 40000, 28000.0, DgtBadge.C
        )

        # Comprador buscando etiqueta ECO con presupuesto 17.000 €
        demand_eco = create_buyer_demand(self.dealer, budget_max=17000.0, required_dgt_badge=DgtBadge.ECO)
        matches = match_vehicles_for_demand(demand_eco, [car_golf, car_yaris, car_bmw])

        self.assertEqual(len(matches), 1)
        self.assertEqual(matches[0].vehicle_id, car_yaris.vehicle_id)

        # Comprador buscando cualquier coche hasta 15.000 €
        demand_budget = create_buyer_demand(self.dealer, budget_max=15000.0)
        matches_budget = match_vehicles_for_demand(demand_budget, [car_golf, car_yaris, car_bmw])

        self.assertEqual(len(matches_budget), 1)
        self.assertEqual(matches_budget[0].vehicle_id, car_golf.vehicle_id)

    def test_case_lifecycle_and_spanish_legal_milestones(self) -> None:
        case = create_case(self.dealer, "Venta de Golf VO con financiación y cambio de titularidad DGT")

        self.assertEqual(case.state, CaseState.INTAKE)
        self.assertEqual(case.tenant_id, self.dealer.tenant_id)

        # Transición de estados
        case = transition_case(case, CaseState.TRIAGED)
        case = transition_case(case, CaseState.IN_PROGRESS)
        case = transition_case(case, CaseState.QUALITY_REVIEW)
        case = transition_case(case, CaseState.APPROVED)
        case = transition_case(case, CaseState.CLOSED)
        self.assertEqual(case.state, CaseState.CLOSED)

        # Hitos legales en España
        self.assertFalse(verify_spanish_legal_milestones(case))
        case_with_milestones = Case(
            case_id="case-123",
            tenant_id=self.dealer.tenant_id,
            dealer_slug=self.dealer.dealer_slug,
            objective="Venta cerrada",
            dgt_checked=True,
            contract_signed=True,
            warranty_issued=True,
        )
        self.assertTrue(verify_spanish_legal_milestones(case_with_milestones))

    def test_diagnose_vehicle_rotation_72h_alert(self) -> None:
        from broker_core.domain import StockRotationStatus, MarketPriceStatus, diagnose_vehicle_rotation
        car = create_vehicle(
            dealership=self.dealer,
            brand="Renault",
            model="Clio",
            version="1.0 TCe",
            year=2021,
            mileage_km=45000,
            cash_price=12900.0,
            dgt_badge=DgtBadge.C,
        )
        # 2 días en stock, 0 clics, 0 leads, precio alineado
        report = diagnose_vehicle_rotation(
            vehicle=car,
            days_in_stock=2,
            clicks_count=0,
            leads_count=0,
            estimated_market_price=13000.0,
        )
        self.assertEqual(report.rotation_status, StockRotationStatus.ALERT_72H)
        self.assertEqual(report.price_status, MarketPriceStatus.FAIR_PRICE)
        self.assertIn("Alerta 72h", report.recommended_action)

    def test_diagnose_vehicle_rotation_30d_overpriced(self) -> None:
        from broker_core.domain import StockRotationStatus, MarketPriceStatus, diagnose_vehicle_rotation
        car = create_vehicle(
            dealership=self.dealer,
            brand="BMW",
            model="Serie 3",
            version="320d",
            year=2019,
            mileage_km=90000,
            cash_price=25000.0,
            dgt_badge=DgtBadge.C,
        )
        # 35 días en stock, precio alto vs mercado (21.000€ estimado)
        report = diagnose_vehicle_rotation(
            vehicle=car,
            days_in_stock=35,
            clicks_count=12,
            leads_count=1,
            estimated_market_price=21000.0,
        )
        self.assertEqual(report.rotation_status, StockRotationStatus.ALERT_30D)
        self.assertEqual(report.price_status, MarketPriceStatus.ABOVE_MARKET)
        self.assertIn("Alerta crítica +30 días", report.recommended_action)

    def test_referral_benefits_calculation(self) -> None:
        from broker_core.domain import calculate_referral_benefits
        # Sin referidos
        acc0 = calculate_referral_benefits("partner-1", "MOTOR-JUAN-2026", 0)
        self.assertEqual(acc0.free_months_earned, 0)
        self.assertFalse(acc0.is_gold_partner)
        self.assertFalse(acc0.has_shared_stock_access)

        # 3 referidos: 3 meses gratis y Gold Partner
        acc3 = calculate_referral_benefits("partner-1", "MOTOR-JUAN-2026", 3)
        self.assertEqual(acc3.free_months_earned, 3)
        self.assertTrue(acc3.is_gold_partner)
        self.assertFalse(acc3.has_shared_stock_access)

        # 5 referidos: Acceso a red colaborativa B2B
        acc5 = calculate_referral_benefits("partner-1", "MOTOR-JUAN-2026", 5)
        self.assertEqual(acc5.free_months_earned, 5)
        self.assertTrue(acc5.has_shared_stock_access)

    def test_vehicle_lifecycle_stages_and_evidence(self) -> None:
        from broker_core.domain import VehicleLifecycleStage, EvidenceLevel
        self.assertEqual(len(VehicleLifecycleStage), 13)
        self.assertEqual(VehicleLifecycleStage.INTAKE, "captado")
        self.assertEqual(VehicleLifecycleStage.DELIVERED, "entregado")
        self.assertEqual(VehicleLifecycleStage.WITHDRAWN, "retirado")

        self.assertEqual(EvidenceLevel.VERIFIED_OBD, "verificado_obd")
        self.assertEqual(EvidenceLevel.VERIFIED_DGT, "verificado_dgt")

    def test_create_delivery_act_validations(self) -> None:
        from broker_core.domain import create_delivery_act
        act = create_delivery_act(
            tenant_id="tenant-autos-demo-es",
            vehicle_id="cm-001",
            buyer_name="David Muñoz",
            mileage_at_delivery=68200,
            fuel_level="Lleno",
            keys_handed_count=2,
            warning_lights_clear=True,
            buyer_confirmed=True,
            seller_confirmed=True,
        )
        self.assertTrue(act.act_id.startswith("act-"))
        self.assertEqual(act.buyer_name, "David Muñoz")
        self.assertEqual(act.mileage_at_delivery, 68200)
        self.assertEqual(act.warranty_months, 12)
        self.assertTrue(act.warning_lights_clear)

        with self.assertRaises(ValueError):
            create_delivery_act(
                tenant_id="tenant-autos-demo-es",
                vehicle_id="cm-001",
                buyer_name="David Muñoz",
                mileage_at_delivery=-10,
                keys_handed_count=0,
            )

    def test_create_warranty_case_validations(self) -> None:
        from broker_core.domain import create_warranty_case
        case = create_warranty_case(
            tenant_id="tenant-autos-demo-es",
            vehicle_id="cm-001",
            buyer_name="David Muñoz",
            issue_description="Ruido en pastillas de freno en frío",
            assigned_workshop="Talleres Hnos. García",
            issue_type="desgaste_ajuste",
        )
        self.assertTrue(case.case_id.startswith("gar-"))
        self.assertEqual(case.status, "abierta")
        self.assertEqual(case.warranty_months, 12)

        with self.assertRaises(ValueError):
            create_warranty_case(
                tenant_id="tenant-autos-demo-es",
                vehicle_id="cm-001",
                buyer_name="",
                issue_description="",
                assigned_workshop="Taller",
            )


    def test_sqlite_multitenant_repository(self) -> None:
        import tempfile
        from broker_core.repository import init_db, get_connection, save_dealership, save_vehicle_record, get_vehicles_by_tenant
        with tempfile.TemporaryDirectory() as tmp_dir:
            test_db = Path(tmp_dir) / "test.db"
            init_db(test_db)
            conn = get_connection(test_db)

            # 1. Registrar dos concesionarios distintos
            save_dealership(conn, "tenant-a", "Taller A", "taller-a", "34600111111")
            save_dealership(conn, "tenant-b", "Concesionario B", "concesionario-b", "34600222222")

            # 2. Registrar vehículo para Tenant A
            save_vehicle_record(conn, {
                "vehicle_id": "veh-1",
                "tenant_id": "tenant-a",
                "brand": "Toyota",
                "model": "Yaris",
                "version": "Active",
                "year": 2021,
                "mileage_km": 35000,
                "cash_price": 15500.0,
                "dgt_badge": "eco",
                "stage": "publicado",
                "evidence_level": "verificado_obd",
            })

            # 3. Validar aislamiento estricto
            cars_a = get_vehicles_by_tenant(conn, "tenant-a")
            cars_b = get_vehicles_by_tenant(conn, "tenant-b")

            self.assertEqual(len(cars_a), 1)
            self.assertEqual(cars_a[0]["model"], "Yaris")
            self.assertEqual(len(cars_b), 0)
            conn.close()


if __name__ == "__main__":
    unittest.main()



