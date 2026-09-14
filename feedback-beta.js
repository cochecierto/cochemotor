(function () {
  'use strict';

  const email = 'hola@cochemotor.es';
  const allowedSources = new Set(['direct', 'home', 'professionals', 'demo', 'hub', 'marketplace', 'vehicle', 'demand']);

  function mailtoHref(subject, body) {
    const query = new URLSearchParams({ subject, body });
    return `mailto:${email}?${query.toString()}`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('beta-feedback-form');
    const directLink = document.getElementById('feedback-direct-link');
    const requestedSource = new URLSearchParams(window.location.search).get('from') || '';
    const source = allowedSources.has(requestedSource) ? requestedSource : 'direct';

    if (directLink) {
      directLink.href = mailtoHref('Comentario sobre la beta de CocheMotor', 'Hola,\n\nQuiero compartir un comentario sobre la beta de CocheMotor.\n');
    }

    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const usefulness = String(data.get('usefulness') || '').trim();
      const comment = String(data.get('comment') || '').trim().slice(0, 1200);
      const body = [
        'Hola, quiero compartir mi opinión sobre la beta de CocheMotor.',
        '',
        `Utilidad: ${usefulness}`,
        `Procedencia: ${source}`,
        `Qué mejoraría: ${comment || '(sin comentario adicional)'}`,
        '',
        'Gracias.'
      ].join('\n');
      window.location.href = mailtoHref('Comentario sobre la beta de CocheMotor', body);
    });
  });
}());
