// ═══════════════════════════════════════════════════════════════════════════
// GOOD CALL AI — CHARTS MODULE
// js/charts.js
// Renderizado de gráficos de barras y actividad por hora
// ═══════════════════════════════════════════════════════════════════════════

const Charts = {

  // ─── Helpers ───────────────────────────────────────────────────────
  fmtShortDate(dateStr) {
    if (!dateStr) return '—';
    const parts = dateStr.split('-');
    return `${parts[2]}/${parts[1]}`;
  },

  // ─── Bar chart (citas por día) ─────────────────────────────────────
  renderBarChart(containerId, data) {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (!data || data.length === 0) {
      el.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:140px;color:var(--text3);font-size:12.5px">Sin datos de citas por día</div>';
      return;
    }

    const maxVal = Math.max(...data.map(d => d.citas), 1);

    el.innerHTML = data.map((d, i) => {
      const h = Math.max((d.citas / maxVal) * 120, 3);
      return `
        <div class="bar-col" style="animation:fu 0.3s ease both;animation-delay:${i * 0.05}s">
          <div class="bar-val">${d.citas}</div>
          <div class="bar" style="height:${h}px" title="${d.fecha}: ${d.citas} citas"></div>
          <div class="bar-label">${this.fmtShortDate(d.fecha)}</div>
        </div>
      `;
    }).join('');
  },

  // ─── Hour chart (actividad 24h) ────────────────────────────────────
  renderHourChart(containerId, data) {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (!data || data.length === 0) {
      el.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text3);font-size:12px">Sin datos</div>';
      return;
    }

    const maxVal = Math.max(...data.map(d => d.total), 1);

    el.innerHTML = data.map(d => {
      const h = Math.max((d.total / maxVal) * 100, 2);
      const opacity = d.total > 0 ? 0.4 + (d.total / maxVal) * 0.6 : 0.15;
      return `<div class="hour-bar" style="height:${h}%;opacity:${opacity}" title="${d.hora}:00 — ${d.total} mensajes"></div>`;
    }).join('');
  }
};
