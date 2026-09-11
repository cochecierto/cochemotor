"""Entidades y transiciones del dominio automotriz para VendoCoche360 (España)."""

from __future__ import annotations

from dataclasses import dataclass, replace
from enum import StrEnum
from urllib.parse import quote
from uuid import uuid4


class CaseState(StrEnum):
    INTAKE = "intake"
    TRIAGED = "triaged"
    IN_PROGRESS = "in_progress"
    QUALITY_REVIEW = "quality_review"
    APPROVED = "approved"
    CLOSED = "closed"
    WAITING_USER = "waiting_user"
    BLOCKED = "blocked"
    CANCELLED = "cancelled"
    REOPENED = "reopened"


class DgtBadge(StrEnum):
    ZERO = "0_emisiones"
    ECO = "eco"
    C = "c"
    B = "b"
    NONE = "sin_distintivo"


class VehicleStatus(StrEnum):
    AVAILABLE = "disponible"
    RESERVED = "reservado"
    SOLD = "vendido"
    PREPARATION = "en_preparacion"


class VehicleLifecycleStage(StrEnum):
    """Las 13 etapas reglamentarias del vehículo en CocheMotor (Spec 003)."""
    INTAKE = "captado"
    IN_VERIFICATION = "en_verificacion"
    IN_TUNING = "en_puesta_a_punto"
    READY_TO_PUBLISH = "listo_para_publicar"
    PUBLISHED = "publicado"
    ACTIVE_LEAD = "lead_activo"
    TEST_DRIVE = "prueba_concertada"
    RESERVED = "reservado"
    CONTRACT_PENDING = "contrato_pendiente"
    SOLD = "vendido"
    DELIVERED = "entregado"
    POST_SALE = "en_posventa"
    WITHDRAWN = "retirado"


class EvidenceLevel(StrEnum):
    """Niveles de rigor y auditabilidad probatoria."""
    DECLARED = "declarado"
    DOCUMENTED = "documentado"
    VERIFIED_OBD = "verificado_obd"
    VERIFIED_DGT = "verificado_dgt"


class SalesPipelineStage(StrEnum):
    PREPARATION = "preparacion"
    PUBLISHED = "publicado"
    LEADS_ACTIVE = "leads_activos"
    TEST_DRIVE = "prueba_en_taller"
    RESERVATION_DGT = "reserva_dgt"
    SOLD = "vendido"


class StockRotationStatus(StrEnum):
    FRESH = "novedad_reciente"
    ALERT_72H = "alerta_72h_sin_traccion"
    ACTIVE = "ritmo_saludable"
    ALERT_30D = "alerta_critica_30_dias"


class MarketPriceStatus(StrEnum):
    BELOW_MARKET = "bajo_mercado"
    FAIR_PRICE = "en_precio"
    ABOVE_MARKET = "alto_mercado"


class TenantIsolationError(ValueError):
    """Indica que se intentó acceder a un recurso desde otro tenant."""


@dataclass(frozen=True)
class Dealership:
    display_name: str
    tenant_id: str
    dealer_slug: str
    phone_whatsapp: str = "34600000000"

    @property
    def agency_slug(self) -> str:
        """Compatibilidad retroactiva."""
        return self.dealer_slug


# Alias de compatibilidad
Agency = Dealership


@dataclass(frozen=True)
class Vehicle:
    vehicle_id: str
    tenant_id: str
    brand: str
    model: str
    version: str
    year: int
    mileage_km: int
    cash_price: float
    dgt_badge: DgtBadge
    status: VehicleStatus = VehicleStatus.AVAILABLE
    public_slug: str = ""


@dataclass(frozen=True)
class BuyerDemand:
    demand_id: str
    tenant_id: str
    budget_max: float
    required_dgt_badge: DgtBadge | None = None


@dataclass(frozen=True)
class Case:
    case_id: str
    tenant_id: str
    dealer_slug: str
    objective: str
    state: CaseState = CaseState.INTAKE
    vehicle_id: str | None = None
    dgt_checked: bool = False
    contract_signed: bool = False
    warranty_issued: bool = False

    @property
    def agency_slug(self) -> str:
        """Compatibilidad retroactiva."""
        return self.dealer_slug


def create_demo_dealership(
    display_name: str = "Autos Ocasión Demo España",
    tenant_id: str = "tenant-autos-demo-es",
    dealer_slug: str = "autos-demo-es",
    phone_whatsapp: str = "34600112233",
) -> Dealership:
    """Crea la identidad sintética del concesionario o compraventa para pruebas."""
    if not display_name.strip() or not tenant_id.strip() or not dealer_slug.strip():
        raise ValueError("El concesionario debe tener nombre, tenant y slug no vacíos.")
    return Dealership(display_name.strip(), tenant_id.strip(), dealer_slug.strip(), phone_whatsapp.strip())


# Alias de compatibilidad
create_demo_agency = create_demo_dealership


def create_vehicle(
    dealership: Dealership,
    brand: str,
    model: str,
    version: str,
    year: int,
    mileage_km: int,
    cash_price: float,
    dgt_badge: DgtBadge,
    status: VehicleStatus = VehicleStatus.AVAILABLE,
) -> Vehicle:
    """Registra un vehículo en el stock del concesionario."""
    if year < 1980 or mileage_km < 0 or cash_price <= 0:
        raise ValueError("Datos técnicos o de precio no válidos.")
    v_id = f"veh-{uuid4().hex[:8]}"
    slug = f"{brand.lower()}-{model.lower()}-{year}-{v_id}"
    return Vehicle(
        vehicle_id=v_id,
        tenant_id=dealership.tenant_id,
        brand=brand.strip(),
        model=model.strip(),
        version=version.strip(),
        year=year,
        mileage_km=mileage_km,
        cash_price=cash_price,
        dgt_badge=dgt_badge,
        status=status,
        public_slug=slug,
    )


def create_buyer_demand(
    dealership: Dealership,
    budget_max: float,
    required_dgt_badge: DgtBadge | None = None,
) -> BuyerDemand:
    """Registra la demanda de un comprador en el concesionario."""
    if budget_max <= 0:
        raise ValueError("El presupuesto debe ser mayor a 0.")
    return BuyerDemand(
        demand_id=f"dem-{uuid4().hex[:8]}",
        tenant_id=dealership.tenant_id,
        budget_max=budget_max,
        required_dgt_badge=required_dgt_badge,
    )


def match_vehicles_for_demand(demand: BuyerDemand, stock: list[Vehicle]) -> list[Vehicle]:
    """Cruza la demanda con el stock del mismo tenant."""
    matches: list[Vehicle] = []
    for vehicle in stock:
        if vehicle.tenant_id != demand.tenant_id:
            continue
        if vehicle.status != VehicleStatus.AVAILABLE:
            continue
        if vehicle.cash_price > demand.budget_max:
            continue
        if demand.required_dgt_badge is not None and vehicle.dgt_badge != demand.required_dgt_badge:
            continue
        matches.append(vehicle)
    return matches


def generate_whatsapp_vehicle_link(dealership: Dealership, vehicle: Vehicle) -> str:
    """Genera el enlace universal de WhatsApp para contacto instantáneo con mensaje pre-rellenado."""
    message = (
        f"Hola, he visto en su web el {vehicle.brand} {vehicle.model} ({vehicle.year}) "
        f"por {vehicle.cash_price:,.0f} € (Etiqueta DGT {vehicle.dgt_badge.value.upper()}). "
        f"¿Sigue disponible para probarlo?"
    )
    return f"https://wa.me/{dealership.phone_whatsapp}?text={quote(message)}"


def create_case(agency: Dealership, objective: str, vehicle_id: str | None = None) -> Case:
    """Crea un expediente comercial asociado al concesionario."""
    if not objective.strip():
        raise ValueError("El objetivo del expediente no puede estar vacío.")
    return Case(
        case_id=f"case-{uuid4().hex}",
        tenant_id=agency.tenant_id,
        dealer_slug=agency.dealer_slug,
        objective=objective.strip(),
        vehicle_id=vehicle_id,
    )


_ALLOWED_TRANSITIONS: dict[CaseState, frozenset[CaseState]] = {
    CaseState.INTAKE: frozenset({CaseState.TRIAGED, CaseState.WAITING_USER, CaseState.BLOCKED}),
    CaseState.TRIAGED: frozenset({CaseState.IN_PROGRESS, CaseState.WAITING_USER, CaseState.BLOCKED}),
    CaseState.IN_PROGRESS: frozenset({CaseState.QUALITY_REVIEW, CaseState.WAITING_USER, CaseState.BLOCKED}),
    CaseState.QUALITY_REVIEW: frozenset({CaseState.APPROVED, CaseState.IN_PROGRESS, CaseState.BLOCKED}),
    CaseState.APPROVED: frozenset({CaseState.CLOSED, CaseState.REOPENED}),
    CaseState.CLOSED: frozenset({CaseState.REOPENED}),
    CaseState.WAITING_USER: frozenset({CaseState.IN_PROGRESS, CaseState.CANCELLED}),
    CaseState.BLOCKED: frozenset({CaseState.IN_PROGRESS, CaseState.CANCELLED}),
    CaseState.CANCELLED: frozenset({CaseState.REOPENED}),
    CaseState.REOPENED: frozenset({CaseState.IN_PROGRESS, CaseState.CANCELLED}),
}


def transition_case(case: Case, target: CaseState) -> Case:
    """Aplica una transición explícita del ciclo de vida del expediente."""
    if target not in _ALLOWED_TRANSITIONS[case.state]:
        raise ValueError(f"Transición no permitida: {case.state} -> {target}.")
    return replace(case, state=target)


def verify_spanish_legal_milestones(case: Case) -> bool:
    """Valida los hitos legales en España (DGT comprobado, contrato y garantía de 1 año)."""
    return case.dgt_checked and case.contract_signed and case.warranty_issued


def get_case(case: Case, tenant_id: str) -> Case:
    """Devuelve el expediente solo si pertenece al tenant solicitado."""
    if case.tenant_id != tenant_id:
        raise TenantIsolationError("El expediente pertenece a otro tenant.")
    return case


def get_vehicle(vehicle: Vehicle, tenant_id: str) -> Vehicle:
    """Devuelve el vehículo solo si pertenece al tenant solicitado."""
    if vehicle.tenant_id != tenant_id:
        raise TenantIsolationError("El vehículo pertenece a otro concesionario.")
    return vehicle


@dataclass(frozen=True)
class PipelineLead:
    lead_id: str
    tenant_id: str
    vehicle_id: str
    buyer_name: str
    phone: str
    email: str
    score: int
    stage: SalesPipelineStage = SalesPipelineStage.LEADS_ACTIVE
    payment_method: str = "financiado"
    has_tradein: bool = False
    notes: str = ""


@dataclass(frozen=True)
class StockRotationReport:
    vehicle_id: str
    days_in_stock: int
    clicks_count: int
    leads_count: int
    rotation_status: StockRotationStatus
    price_status: MarketPriceStatus
    price_delta_percent: float
    recommended_action: str


def diagnose_vehicle_rotation(
    vehicle: Vehicle,
    days_in_stock: int,
    clicks_count: int,
    leads_count: int,
    estimated_market_price: float,
) -> StockRotationReport:
    """Evalúa la rotación del vehículo y emite diagnóstico predictivo con recomendaciones accionables."""
    if days_in_stock < 0 or clicks_count < 0 or leads_count < 0 or estimated_market_price <= 0:
        raise ValueError("Valores métricos no válidos para el diagnóstico.")

    # Diagnóstico de precio vs mercado
    price_delta = ((vehicle.cash_price - estimated_market_price) / estimated_market_price) * 100.0
    if price_delta < -8.0:
        price_status = MarketPriceStatus.BELOW_MARKET
    elif price_delta > 8.0:
        price_status = MarketPriceStatus.ABOVE_MARKET
    else:
        price_status = MarketPriceStatus.FAIR_PRICE

    # Diagnóstico de rotación y tracción comercial
    if days_in_stock <= 3:
        if clicks_count == 0 and leads_count == 0:
            rotation_status = StockRotationStatus.ALERT_72H
            recommended_action = (
                "Alerta 72h sin interacción: Revisa la foto principal de portada, "
                "actualiza el título en Wallapop/Milanuncios y comparte la ficha en WhatsApp."
            )
        else:
            rotation_status = StockRotationStatus.FRESH
            recommended_action = "Novedad en stock con interacciones iniciales favorables. Mantener difusión."
    elif days_in_stock >= 30:
        rotation_status = StockRotationStatus.ALERT_30D
        if price_status == MarketPriceStatus.ABOVE_MARKET:
            recommended_action = (
                f"Alerta crítica +30 días: El precio está un {price_delta:.1f}% por encima del mercado. "
                f"Ajustar a {estimated_market_price:,.0f} € y publicar oferta flash de fin de semana."
            )
        else:
            recommended_action = (
                "Alerta crítica +30 días: Renovar lote fotográfico en exterior con luz natural "
                "y ofrecer campaña de 1 año de seguro incluido para acelerar rotación de campa."
            )
    else:
        rotation_status = StockRotationStatus.ACTIVE
        recommended_action = "Rotación en ciclo normal de comercialización. Seguimiento activo de leads."

    return StockRotationReport(
        vehicle_id=vehicle.vehicle_id,
        days_in_stock=days_in_stock,
        clicks_count=clicks_count,
        leads_count=leads_count,
        rotation_status=rotation_status,
        price_status=price_status,
        price_delta_percent=round(price_delta, 1),
        recommended_action=recommended_action,
    )


@dataclass(frozen=True)
class ReferralAccount:
    partner_id: str
    referral_code: str
    referred_count: int
    free_months_earned: int
    is_gold_partner: bool
    has_shared_stock_access: bool


def calculate_referral_benefits(partner_id: str, referral_code: str, referred_active_users: int) -> ReferralAccount:
    """Calcula los incentivos de viralidad B2B para el profesional."""
    if referred_active_users < 0:
        raise ValueError("El número de referidos no puede ser negativo.")

    free_months = referred_active_users  # 1 mes gratis por cada referido activo
    is_gold = referred_active_users >= 3
    has_shared_stock = referred_active_users >= 5

    return ReferralAccount(
        partner_id=partner_id,
        referral_code=referral_code,
        referred_count=referred_active_users,
        free_months_earned=free_months,
        is_gold_partner=is_gold,
        has_shared_stock_access=has_shared_stock,
    )


@dataclass(frozen=True)
class DeliveryChecklistItem:
    title: str
    is_confirmed: bool = False


@dataclass(frozen=True)
class DeliveryAct:
    """Acta digital de entrega de vehículo (Spec 003)."""
    act_id: str
    tenant_id: str
    vehicle_id: str
    buyer_name: str
    mileage_at_delivery: int
    fuel_level: str
    keys_handed_count: int
    warning_lights_clear: bool
    buyer_signature_confirmed: bool
    seller_signature_confirmed: bool
    warranty_months: int = 12


def create_delivery_act(
    tenant_id: str,
    vehicle_id: str,
    buyer_name: str,
    mileage_at_delivery: int,
    fuel_level: str = "3/4 depósito",
    keys_handed_count: int = 2,
    warning_lights_clear: bool = True,
    buyer_confirmed: bool = True,
    seller_confirmed: bool = True,
) -> DeliveryAct:
    """Emite el acta digital de entrega con comprobaciones de integridad."""
    if mileage_at_delivery < 0 or keys_handed_count < 1:
        raise ValueError("Datos del acta de entrega no válidos.")
    return DeliveryAct(
        act_id=f"act-{uuid4().hex[:8]}",
        tenant_id=tenant_id,
        vehicle_id=vehicle_id,
        buyer_name=buyer_name.strip(),
        mileage_at_delivery=mileage_at_delivery,
        fuel_level=fuel_level,
        keys_handed_count=keys_handed_count,
        warning_lights_clear=warning_lights_clear,
        buyer_signature_confirmed=buyer_confirmed,
        seller_signature_confirmed=seller_confirmed,
    )


