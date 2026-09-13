// API pública: en local conserva las rutas relativas; en producción usa el broker del VPS.
window.COCHEMOTOR_API_BASE = window.location.hostname === 'cochemotor.es' || window.location.hostname === 'www.cochemotor.es'
  ? 'https://api.cochemotor.es'
  : '';

if (window.COCHEMOTOR_API_BASE && window.fetch) {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    if (typeof input === 'string' && input.startsWith('/api/')) input = window.COCHEMOTOR_API_BASE + input;
    return nativeFetch(input, init);
  };
}
