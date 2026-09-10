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


if __name__ == "__main__":
    unittest.main()
