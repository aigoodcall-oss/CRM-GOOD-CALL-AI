// ═══════════════════════════════════════════════════════════════════════════
// GOOD CALL AI — APP MODULE
// js/app.js
// Main application: router, navigation, init
// ═══════════════════════════════════════════════════════════════════════════

const App = {

  currentPage: 'resumen',

  // ─── NAVIGATION ────────────────────────────────────────────────────
  navigateTo(page) {
    this.currentPage = page;

    // Update sidebar active state
    document.querySelectorAll('.si[data-page]').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });

    // Update topnav active state
    document.querySelectorAll('.top-nav-item[data-nav]').forEach(el => {
      el.classList.toggle('active', el.dataset.nav === page);
    });

    // Render page
    const pageObj = Pages[page];
    if (!pageObj) {
      console.warn(`Page "${page}" not found`);
      return;
    }

    const main = document.getElementById('main-content');
    main.innerHTML = pageObj.render();

    // Animate children
    main.querySelectorAll(':scope > *').forEach((el, i) => {
      el.style.animation = 'none';
      el.offsetHeight; // reflow
      el.style.animation = `fu 0.22s ease both`;
      el.style.animationDelay = `${i * 0.04}s`;
    });

    // Post-render hook (for charts, etc.)
    if (pageObj.afterRender) {
      pageObj.afterRender();
    }
  },

  // ─── REFRESH DATA ──────────────────────────────────────────────────
  async refreshData() {
    const btn = document.getElementById('globalRefresh');
    if (btn) btn.classList.add('spinning');

    await Api.fetchAllData();

    if (btn) btn.classList.remove('spinning');

    // Re-render current page
    this.navigateTo(this.currentPage);
  },

  // ─── LOGOUT ────────────────────────────────────────────────────────
  handleLogout() {
    Auth.logout();
    window.location.href = '/';
  },

  // ─── UPDATE USER UI ────────────────────────────────────────────────
  updateUserUI() {
    const initialsEl = document.getElementById('userInitials');
    const nameEl = document.getElementById('userName');

    if (initialsEl) initialsEl.textContent = Auth.getUserInitials();
    if (nameEl) nameEl.textContent = Auth.getUserName();
  },

  // ─── INIT ──────────────────────────────────────────────────────────
  async init() {
    // 1. Check auth
    if (!Auth.requireAuth()) return;

    // 2. Verify token with server (async, non-blocking)
    Auth.verify();

    // 3. Update user UI
    this.updateUserUI();

    // 4. Load data
    await Api.fetchAllData();

    // 5. Render default page
    this.navigateTo('resumen');

    // 6. Auto-refresh every 60s
    setInterval(() => {
      Api.fetchAllData().then(() => {
        this.navigateTo(this.currentPage);
      });
    }, 60000);

    // 7. Keyboard shortcuts
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        // Close any modal/overlay if needed
      }
    });

    console.log('✅ App initialized');
  }
};
