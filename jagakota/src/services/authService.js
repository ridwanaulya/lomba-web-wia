const AUTH_KEY = "jagakota_auth";

const DEMO_ACCOUNTS = [
  {
    email: "admin@jagakota.go.id",
    password: "admin123",
    name: "Admin Dinas Utama",
    role: "Super Admin",
    dinas: "Semua Dinas",
  },
];

export const authService = {
  login(email, password) {
    const account = DEMO_ACCOUNTS.find(
      (a) => a.email === email && a.password === password
    );
    if (account) {
      const session = {
        ...account,
        loginAt: new Date().toISOString(),
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      return { success: true, user: session };
    }
    return { success: false, error: "Email atau password salah." };
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
  },

  getSession() {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  isLoggedIn() {
    return this.getSession() !== null;
  },
};
