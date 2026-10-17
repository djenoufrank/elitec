import { api } from "./ApiClient";

/** Authentication API operations and local token persistence. */
class AuthService {
  async getCurrentUser() {
    const { data } = await api.get("/auth/me");
    return data;
  }

  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    this.saveToken(data.token);
    return data;
  }

  async register(payload) {
    const { data } = await api.post("/auth/register", payload);
    this.saveToken(data.token);
    return data;
  }

  logout() {
    try { localStorage.removeItem("elitec_token"); } catch { /* Storage may be disabled. */ }
  }

  saveToken(token) {
    try { localStorage.setItem("elitec_token", token); } catch { /* In-memory auth still works. */ }
  }
}

export const authService = new AuthService();
