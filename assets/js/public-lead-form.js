(() => {
  const form = document.getElementById('vehicle-contact-form');
  if (!form) return;
  const status = document.getElementById('lead-status');
  const submit = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const body = {
      vehicle_id: form.dataset.vehicleId,
      buyer_name: form.elements.buyer_name.value.trim(),
      phone: form.elements.phone.value.trim(),
      payment_method: form.elements.payment_method.value,
      contact_requested: form.elements.contact_requested.checked,
      privacy_notice_version: 'lead-contact-v1',
      website: form.elements.website.value
    };
    submit.disabled = true;
    status.textContent = 'Enviando solicitud…';
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) throw new Error(result?.error || 'No se pudo enviar la solicitud.');
      status.textContent = 'Solicitud guardada y disponible en el panel del profesional.';
      form.reset();
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : 'No se pudo enviar la solicitud. Conservamos tus datos para que puedas intentarlo de nuevo.';
    } finally {
      submit.disabled = false;
    }
  });
})();
