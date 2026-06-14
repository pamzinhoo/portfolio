const ATLAS_DEFAULT_API_URL = (() => {
  const host = window.location.hostname || 'localhost';

  if (host === 'localhost' || host === '127.0.0.1') {
    return `${window.location.protocol}//${host}:8000/api`;
  }

  const configured =
    window.ATLAS_API_URL ||
    window.ATLAS_BACKEND_URL ||
    localStorage.getItem('ATLAS_API_URL') ||
    document.querySelector('meta[name="atlas-api-url"]')?.content;

  if (configured) {
    return configured.replace(/\/$/, '');
  }

  // Producao com front e back separados: troque por sua URL real do backend
  // ou defina window.ATLAS_API_URL antes de carregar este arquivo.
  return 'https://atlas-api-dixg.onrender.com/api';
})();

window.ATLAS_CONFIG = {
  apiUrl: ATLAS_DEFAULT_API_URL,
};
