import axios from './api';
import jwtDecode from 'jwt-decode';

const STORAGE_KEY = 'harari_admin_token';

const auth = {
  async login(email, password) {
    try {
      const res = await axios.post('/auth/login', { email, password });
      if (res?.data?.data?.token) {
        sessionStorage.setItem(STORAGE_KEY, res.data.data.token);
        return { ok: true };
      }
      return { ok: false, message: 'Invalid response' };
    } catch (err) {
      return { ok: false, message: err?.response?.data?.message || err.message };
    }
  },
  logout() {
    sessionStorage.removeItem(STORAGE_KEY);
  },
  getToken() {
    return sessionStorage.getItem(STORAGE_KEY);
  },
  getProfile() {
    const token = auth.getToken();
    if (!token) return null;
    try {
      // try real jwt decode
      try {
        return jwtDecode(token);
      } catch (e) {
        // fallback for our base64 fake
        const decoded = JSON.parse(atob(token));
        return decoded;
      }
    } catch (err) {
      return null;
    }
  },
  isExpired() {
    const profile = auth.getProfile();
    if (!profile || !profile.exp) return true;
    return profile.exp * 1000 < Date.now();
  }
}

export default auth;
