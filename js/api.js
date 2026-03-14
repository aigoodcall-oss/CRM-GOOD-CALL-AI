// ═══════════════════════════════════════════════════════════════════════════
// GOOD CALL AI — API MODULE
// js/api.js
// Wrapper de fetch con autenticación automática
// ═══════════════════════════════════════════════════════════════════════════

const API_BASE = 'https://api.goodcallai.net';

const Api = {

  // ─── Authenticated fetch ───────────────────────────────────────────
  async request(endpoint, options = {}) {
    const token = Auth.getToken();

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      }
    };

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, config);

    // Token expirado → redirigir a login
    if (res.status === 401) {
      Auth.logout();
      window.location.href = '/';
      throw new Error('Sesión expirada');
    }

    return res;
  },

  async get(endpoint) {
    const res = await this.request(endpoint);
    return res.json();
  },

  async post(endpoint, body) {
    const res = await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
    return res.json();
  },

  async del(endpoint) {
    const res = await this.request(endpoint, { method: 'DELETE' });
    return res.json();
  },

  // ═══════════════════════════════════════════════════════════════════
  // DATA LOADERS
  // ═══════════════════════════════════════════════════════════════════

  // Estado global de datos
  data: {
    resumen: null,
    citasPorDia: null,
    ultimasCitas: null,
    horas: null,
    loaded: false
  },

  async fetchAllData() {
    try {
      const [resumen, citasPorDia, ultimasCitas, horas] = await Promise.all([
        this.get('/stats/resumen').catch(() => null),
        this.get('/stats/citas-por-dia').catch(() => null),
        this.get('/stats/ultimas-citas').catch(() => null),
        this.get('/stats/horas').catch(() => null),
      ]);

      this.data.resumen = resumen;
      this.data.citasPorDia = citasPorDia;
      this.data.ultimasCitas = ultimasCitas;
      this.data.horas = horas;
      this.data.loaded = true;

      console.log('✅ Datos cargados', this.data);
      return this.data;
    } catch (e) {
      console.error('❌ Error cargando datos:', e);
      return this.data;
    }
  }
};
