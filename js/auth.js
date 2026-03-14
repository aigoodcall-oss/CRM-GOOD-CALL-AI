// ═══════════════════════════════════════════════════════════════════════════
// GOOD CALL AI — AUTH MODULE
// js/auth.js
// Manejo de tokens JWT, login, logout, protección de rutas
// ═══════════════════════════════════════════════════════════════════════════

const Auth = {

  TOKEN_KEY: 'gc_token',
  USER_KEY: 'gc_user',

  // ─── Token management ──────────────────────────────────────────────
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  },

  getUser() {
    try {
      const data = localStorage.getItem(this.USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  },

  isLoggedIn() {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired (JWT decode without verification)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      this.logout();
      return false;
    }
  },

  // ─── Login ─────────────────────────────────────────────────────────
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    this.setToken(data.token);
    this.setUser(data.user);
    return data.user;
  },

  // ─── Verify token with server ──────────────────────────────────────
  async verify() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        this.logout();
        return false;
      }

      const data = await res.json();
      this.setUser(data.user);
      return true;
    } catch {
      // Network error — don't logout, might be temporary
      return this.isLoggedIn(); // fallback to local token check
    }
  },

  // ─── Logout ────────────────────────────────────────────────────────
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  },

  // ─── Route guards ──────────────────────────────────────────────────
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = '/';
      return false;
    }
    return true;
  },

  redirectIfLoggedIn() {
    if (this.isLoggedIn()) {
      window.location.href = '/app.html';
      return true;
    }
    return false;
  },

  // ─── User initials for avatar ──────────────────────────────────────
  getUserInitials() {
    const user = this.getUser();
    if (!user || !user.name) return 'GC';
    return user.name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },

  getUserName() {
    const user = this.getUser();
    return user?.name || 'Admin';
  },

  getUserRole() {
    const user = this.getUser();
    return user?.role || 'admin';
  }
};
