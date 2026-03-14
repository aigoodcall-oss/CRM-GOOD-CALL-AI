// ═══════════════════════════════════════════════════════════════════════════
// GOOD CALL AI — PAGES MODULE
// js/pages.js
// Renderers para cada sección del CRM
// ═══════════════════════════════════════════════════════════════════════════

const Pages = {};

// ─── HELPERS ──────────────────────────────────────────────────────────────
function fmtDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  const dias = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${dias[d.getDay()]} ${d.getDate()} ${meses[d.getMonth()]}`;
}

function fmtShortDate(dateStr) {
  if (!dateStr) return '—';
  const parts = dateStr.split('-');
  return `${parts[2]}/${parts[1]}`;
}

function estadoPill(estado) {
  const map = {
    'pendiente':  '<span class="pill pend">pendiente</span>',
    'confirmada': '<span class="pill conf">confirmada</span>',
    'cancelada':  '<span class="pill cancel">cancelada</span>',
  };
  return map[estado] || `<span class="pill pau">${estado || 'sin estado'}</span>`;
}

function initial(name) {
  return (name || '?').charAt(0).toUpperCase();
}


// ═══════════════════════════════════════════════════════════════════════════
// RESUMEN
// ═══════════════════════════════════════════════════════════════════════════

Pages.resumen = {
  render() {
    const d = Api.data.resumen || {};
    const citas = Api.data.ultimasCitas || [];
    const userName = Auth.getUserName();

    const citasHTML = citas.length > 0 ? `
      <table>
        <thead><tr><th>Paciente</th><th>Servicio</th><th>Fecha</th><th>Hora</th><th>Estado</th></tr></thead>
        <tbody>
          ${citas.slice(0, 5).map(c => `
            <tr>
              <td class="td-m">${c.nombre}</td>
              <td>${c.servicio}</td>
              <td class="td-mono">${fmtDate(c.fecha)}</td>
              <td class="td-mono">${c.hora || '—'}</td>
              <td>${estadoPill(c.estado)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : `
      <div class="empty" style="padding:28px 20px">
        <div class="empty-t">Sin citas registradas</div>
        <div class="empty-s">Las citas agendadas por el bot aparecerán aquí</div>
      </div>
    `;

    return `
      <div class="ph">
        <div class="ph-title">Bienvenido, ${userName}</div>
        <div class="ph-sub"><span class="live-dot"></span>Bot activo — datos en tiempo real</div>
      </div>

      <div class="stats-row">
        <div class="stat">
          <div class="stat-top">
            <div class="stat-label">Conversaciones hoy</div>
            <div class="stat-icon" style="background:#eff6ff"><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#5b8ff9" stroke-width="1.6"><path d="M2 3h12a1 1 0 011 1v7a1 1 0 01-1 1H5l-3 2V4a1 1 0 011-1z"/></svg></div>
          </div>
          <div class="stat-value">${d.conversaciones_hoy ?? '—'}</div>
          <div class="stat-note">hoy</div>
        </div>
        <div class="stat">
          <div class="stat-top">
            <div class="stat-label">Conversaciones total</div>
            <div class="stat-icon" style="background:#faf5ff"><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#a855f7" stroke-width="1.6"><path d="M2 3h12a1 1 0 011 1v7a1 1 0 01-1 1H5l-3 2V4a1 1 0 011-1z"/></svg></div>
          </div>
          <div class="stat-value">${d.conversaciones_total ?? '—'}</div>
          <div class="stat-note">acumulado</div>
        </div>
        <div class="stat">
          <div class="stat-top">
            <div class="stat-label">Tasa de conversión</div>
            <div class="stat-icon" style="background:#ecfdf5"><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#10b981" stroke-width="1.6"><polyline points="1,11 4.5,7 7.5,9.5 11.5,4 15,6"/></svg></div>
          </div>
          <div class="stat-value">${d.tasa_conversion != null ? d.tasa_conversion + '%' : '—'}</div>
          <div class="stat-note">conv → cita</div>
        </div>
        <div class="stat">
          <div class="stat-top">
            <div class="stat-label">Citas agendadas</div>
            <div class="stat-icon" style="background:#fff7ed"><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#f59e0b" stroke-width="1.6"><rect x="2" y="3" width="12" height="11" rx="1.5"/><line x1="2" y1="7" x2="14" y2="7"/></svg></div>
          </div>
          <div class="stat-value">${d.citas_total ?? '—'}</div>
          <div class="stat-note">total</div>
        </div>
      </div>

      <div class="g2">
        <div class="card">
          <div class="ch"><div class="ch-title">Citas por día (últimos 7 días)</div></div>
          <div class="chart-wrap"><div class="bar-chart" id="chartCitasDia"></div></div>
        </div>
        <div class="card">
          <div class="ch">
            <div class="ch-title">Bot activo</div>
            <div class="ch-link" onclick="App.navigateTo('mis-bots')">Ver detalles</div>
          </div>
          <div class="bot-row" onclick="App.navigateTo('mis-bots')">
            <div class="bot-av">🦷</div>
            <div class="bot-info">
              <div class="bot-name">Luna — Dental Bot</div>
              <div class="bot-num">WhatsApp · +51 ···</div>
            </div>
            <span class="pill on">activo</span>
          </div>
          <div style="padding:14px 16px">
            <div style="font-size:11px;color:var(--text3);font-family:'JetBrains Mono',monospace;margin-bottom:6px">ACTIVIDAD POR HORA (24h)</div>
            <div class="hour-chart" id="chartHorasResumen"></div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:14px">
        <div class="ch">
          <div class="ch-title">Últimas citas agendadas</div>
          <div class="ch-link" onclick="App.navigateTo('citas')">Ver todas</div>
        </div>
        ${citasHTML}
      </div>
    `;
  },

  afterRender() {
    Charts.renderBarChart('chartCitasDia', Api.data.citasPorDia);
    Charts.renderHourChart('chartHorasResumen', Api.data.horas);
  }
};


// ═══════════════════════════════════════════════════════════════════════════
// MIS BOTS
// ═══════════════════════════════════════════════════════════════════════════

Pages['mis-bots'] = {
  render() {
    const d = Api.data.resumen || {};
    return `
      <div class="ph">
        <div class="ph-title">Mis Bots</div>
        <div class="ph-sub">Administra y monitorea tus bots activos.</div>
      </div>
      <div class="card">
        <div class="ch"><div class="ch-title">Bots configurados</div><span class="si-badge" style="font-size:11px">1 bot</span></div>
        <div class="bot-row" onclick="App.navigateTo('configurar-bot')">
          <div class="bot-av">🦷</div>
          <div class="bot-info">
            <div class="bot-name">Luna — Asistente Dental</div>
            <div class="bot-num">WhatsApp Business · Hetzner CX23</div>
          </div>
          <span class="pill on">activo</span>
        </div>
        <div style="padding:18px">
          <div class="g2eq" style="gap:12px">
            <div style="background:var(--bg);border-radius:8px;padding:14px">
              <div style="font-size:11px;color:var(--text3);font-family:'JetBrains Mono',monospace;margin-bottom:8px">ESTADÍSTICAS</div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:12.5px;color:var(--text2)">Conversaciones totales</span><span style="font-size:13px;font-weight:600">${d.conversaciones_total ?? '—'}</span></div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:12.5px;color:var(--text2)">Citas agendadas</span><span style="font-size:13px;font-weight:600">${d.citas_total ?? '—'}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="font-size:12.5px;color:var(--text2)">Tasa de conversión</span><span style="font-size:13px;font-weight:600">${d.tasa_conversion != null ? d.tasa_conversion + '%' : '—'}</span></div>
            </div>
            <div style="background:var(--bg);border-radius:8px;padding:14px">
              <div style="font-size:11px;color:var(--text3);font-family:'JetBrains Mono',monospace;margin-bottom:8px">CONFIGURACIÓN</div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:12.5px;color:var(--text2)">Servidor</span><span class="td-mono" style="color:var(--text)">89.167.100.149</span></div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:12.5px;color:var(--text2)">Puerto</span><span class="td-mono" style="color:var(--text)">3000</span></div>
              <div style="display:flex;justify-content:space-between"><span style="font-size:12.5px;color:var(--text2)">Base de datos</span><span class="td-mono" style="color:var(--text)">SQLite</span></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};


// ═══════════════════════════════════════════════════════════════════════════
// CONVERSACIONES
// ═══════════════════════════════════════════════════════════════════════════

Pages.conversaciones = {
  render() {
    const citas = Api.data.ultimasCitas || [];

    const rows = citas.length > 0 ? citas.map(c => `
      <div class="conv-row">
        <div class="conv-avatar">${initial(c.nombre)}</div>
        <div class="conv-info">
          <div class="conv-name">${c.nombre}</div>
          <div class="conv-preview">Agendó: ${c.servicio}</div>
        </div>
        <div class="conv-meta">
          <div class="conv-time">${fmtShortDate(c.fecha)}</div>
          ${estadoPill(c.estado)}
        </div>
      </div>
    `).join('') : `
      <div class="empty" style="padding:56px 20px">
        <div class="empty-t">Sin conversaciones aún</div>
        <div class="empty-s">Las conversaciones de tus bots aparecerán aquí</div>
      </div>
    `;

    return `
      <div class="ph">
        <div class="ph-title">Conversaciones</div>
        <div class="ph-sub">Historial de interacciones gestionadas por el bot.</div>
      </div>
      <div class="card">
        <div class="ch">
          <div class="ch-title">Conversaciones recientes</div>
          <span class="si-badge" style="font-size:11px">${citas.length} registros</span>
        </div>
        ${rows}
      </div>
      <div class="info-banner">
        <strong>ℹ Nota:</strong> Actualmente se muestran las citas agendadas como proxy. Para ver el historial completo de mensajes, se requiere un nuevo endpoint en la API (<code>/stats/conversaciones</code>).
      </div>
    `;
  }
};


// ═══════════════════════════════════════════════════════════════════════════
// CITAS
// ═══════════════════════════════════════════════════════════════════════════

Pages.citas = {
  render() {
    const citas = Api.data.ultimasCitas || [];
    const d = Api.data.resumen || {};

    const citasHTML = citas.length > 0 ? `
      <table>
        <thead><tr><th>Paciente</th><th>Teléfono</th><th>Servicio</th><th>Fecha</th><th>Hora</th><th>Estado</th></tr></thead>
        <tbody>
          ${citas.map(c => `
            <tr>
              <td class="td-m">${c.nombre}</td>
              <td class="td-mono">${c.phone || '—'}</td>
              <td>${c.servicio}</td>
              <td class="td-mono">${fmtDate(c.fecha)}</td>
              <td class="td-mono">${c.hora || '—'}</td>
              <td>${estadoPill(c.estado)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : `
      <div class="empty" style="padding:56px 20px">
        <div class="empty-t">Sin citas registradas</div>
        <div class="empty-s">Las citas agendadas por el bot aparecerán aquí</div>
      </div>
    `;

    return `
      <div class="ph">
        <div class="ph-title">Citas</div>
        <div class="ph-sub">Todas las citas agendadas por el bot.</div>
      </div>
      <div class="stats-row" style="grid-template-columns:repeat(3,1fr)">
        <div class="stat">
          <div class="stat-top"><div class="stat-label">Citas hoy</div><div class="stat-icon" style="background:#eff6ff"><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#5b8ff9" stroke-width="1.6"><rect x="2" y="3" width="12" height="11" rx="1.5"/><line x1="2" y1="7" x2="14" y2="7"/></svg></div></div>
          <div class="stat-value">${d.citas_hoy ?? 0}</div>
          <div class="stat-note">hoy</div>
        </div>
        <div class="stat">
          <div class="stat-top"><div class="stat-label">Citas totales</div><div class="stat-icon" style="background:#ecfdf5"><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#10b981" stroke-width="1.6"><rect x="2" y="3" width="12" height="11" rx="1.5"/><line x1="2" y1="7" x2="14" y2="7"/></svg></div></div>
          <div class="stat-value">${d.citas_total ?? 0}</div>
          <div class="stat-note">acumulado</div>
        </div>
        <div class="stat">
          <div class="stat-top"><div class="stat-label">Tasa de conversión</div><div class="stat-icon" style="background:#fff7ed"><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#f59e0b" stroke-width="1.6"><polyline points="1,11 4.5,7 7.5,9.5 11.5,4 15,6"/></svg></div></div>
          <div class="stat-value">${d.tasa_conversion != null ? d.tasa_conversion + '%' : '—'}</div>
          <div class="stat-note">conv → cita</div>
        </div>
      </div>
      <div class="card">
        <div class="ch"><div class="ch-title">Todas las citas</div><span class="si-badge" style="font-size:11px">${citas.length} citas</span></div>
        ${citasHTML}
      </div>
    `;
  }
};


// ═══════════════════════════════════════════════════════════════════════════
// ANALÍTICAS
// ═══════════════════════════════════════════════════════════════════════════

Pages.analiticas = {
  render() {
    const d = Api.data.resumen || {};
    return `
      <div class="ph">
        <div class="ph-title">Analíticas</div>
        <div class="ph-sub">Métricas de rendimiento y actividad del bot.</div>
      </div>
      <div class="stats-row">
        <div class="stat">
          <div class="stat-top"><div class="stat-label">Conversaciones hoy</div><div class="stat-icon" style="background:#eff6ff"><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#5b8ff9" stroke-width="1.6"><path d="M2 3h12a1 1 0 011 1v7a1 1 0 01-1 1H5l-3 2V4a1 1 0 011-1z"/></svg></div></div>
          <div class="stat-value">${d.conversaciones_hoy ?? '—'}</div>
          <div class="stat-note">hoy</div>
        </div>
        <div class="stat">
          <div class="stat-top"><div class="stat-label">Total conversaciones</div><div class="stat-icon" style="background:#faf5ff"><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#a855f7" stroke-width="1.6"><path d="M2 3h12a1 1 0 011 1v7a1 1 0 01-1 1H5l-3 2V4a1 1 0 011-1z"/></svg></div></div>
          <div class="stat-value">${d.conversaciones_total ?? '—'}</div>
          <div class="stat-note">acumulado</div>
        </div>
        <div class="stat">
          <div class="stat-top"><div class="stat-label">Citas agendadas</div><div class="stat-icon" style="background:#ecfdf5"><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#10b981" stroke-width="1.6"><rect x="2" y="3" width="12" height="11" rx="1.5"/><line x1="2" y1="7" x2="14" y2="7"/></svg></div></div>
          <div class="stat-value">${d.citas_total ?? '—'}</div>
          <div class="stat-note">total</div>
        </div>
        <div class="stat">
          <div class="stat-top"><div class="stat-label">Clientes recurrentes</div><div class="stat-icon" style="background:#fff7ed"><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#f59e0b" stroke-width="1.6"><circle cx="6" cy="5" r="3"/><path d="M1 14c0-3.3 2.2-5 5-5M12 9v4M10 11h4"/></svg></div></div>
          <div class="stat-value">${d.clientes_recurrentes ?? '—'}</div>
          <div class="stat-note">volvieron</div>
        </div>
      </div>
      <div class="g2eq" style="margin-bottom:14px">
        <div class="card">
          <div class="ch"><div class="ch-title">Citas por día (últimos 7 días)</div></div>
          <div class="chart-wrap"><div class="bar-chart" id="chartCitasDiaAn"></div></div>
        </div>
        <div class="card">
          <div class="ch"><div class="ch-title">Actividad por hora (24h)</div></div>
          <div class="chart-wrap"><div class="hour-chart" id="chartHorasAn" style="height:140px"></div></div>
        </div>
      </div>
    `;
  },

  afterRender() {
    Charts.renderBarChart('chartCitasDiaAn', Api.data.citasPorDia);
    Charts.renderHourChart('chartHorasAn', Api.data.horas);
  }
};


// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURAR BOT
// ═══════════════════════════════════════════════════════════════════════════

Pages['configurar-bot'] = {
  render() {
    return `
      <div class="ph">
        <div class="ph-title">Configurar Bot</div>
        <div class="ph-sub">Personaliza el comportamiento de Luna — Asistente Dental.</div>
      </div>
      <div class="g2eq">
        <div class="card">
          <div class="ch"><div class="ch-title">Comportamiento</div></div>
          <div class="cr"><div><div class="cr-label">Respuestas automáticas</div><div class="cr-sub">Operación continua sin intervención</div></div><div class="toggle on" onclick="this.classList.toggle('on')"></div></div>
          <div class="cr"><div><div class="cr-label">Agendar citas</div><div class="cr-sub">Permitir al bot agendar citas automáticamente</div></div><div class="toggle on" onclick="this.classList.toggle('on')"></div></div>
          <div class="cr"><div><div class="cr-label">Modo fuera de horario</div><div class="cr-sub">Respuesta automática fuera de horario laboral</div></div><div class="toggle" onclick="this.classList.toggle('on')"></div></div>
          <div class="cr" style="border-bottom:none"><div><div class="cr-label">Confirmación de lectura</div><div class="cr-sub">Mostrar "visto" al usuario</div></div><div class="toggle on" onclick="this.classList.toggle('on')"></div></div>
        </div>
        <div class="card">
          <div class="ch"><div class="ch-title">Motor y conexión</div></div>
          <div class="cr"><div><div class="cr-label">Plataforma</div><div class="cr-sub">Canal de mensajería</div></div><span class="td-mono" style="color:var(--text);background:var(--surface2);padding:4px 10px;border-radius:6px">WhatsApp</span></div>
          <div class="cr" style="border-bottom:none"><div><div class="cr-label">Servidor</div><div class="cr-sub">Infraestructura del bot</div></div><span class="td-mono" style="color:var(--text);background:var(--surface2);padding:4px 10px;border-radius:6px">Hetzner CX23</span></div>
          <div style="padding:0 18px 16px;display:flex;justify-content:flex-end">
            <button class="btn btn-primary" onclick="alert('⚠️ Para cambios en el prompt, edita en el servidor: /opt/rainy-bot/src/index.js')">Guardar cambios</button>
          </div>
        </div>
      </div>
    `;
  }
};
