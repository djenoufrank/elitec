import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

/** Central HTTP client: API URL, JSON headers and the current access token. */
export const api = axios.create({
  baseURL: `${backendUrl}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("elitec_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // The app can still make public requests when browser storage is unavailable.
  }
  return config;
});

export function formatApiError(err, fallback = "Something went wrong") {
  const detail = err?.response?.data?.detail;
  if (!detail) return err?.message || fallback;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).join(" ");
  }
  if (detail && typeof detail.msg === "string") return detail.msg;
  return fallback;
}
