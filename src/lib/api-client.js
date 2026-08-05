import axios from "axios";

/**
 * The single axios instance for the whole app.
 *
 * Access tokens are short-lived and kept in memory + localStorage; the refresh
 * token lives in an HttpOnly cookie the browser sends automatically. On a 401
 * we refresh once and replay the original request, queueing any calls that
 * raced the refresh so a page load never fires several refreshes at once.
 */

const TOKEN_KEY = "unisale.token";
const isBrowser = typeof window !== "undefined";

let inMemoryToken = null;
let onAuthFailure = null;

export const setAuthFailureHandler = (handler) => {
  onAuthFailure = handler;
};

export const getStoredToken = () => {
  if (inMemoryToken) return inMemoryToken;
  if (!isBrowser) return null;
  inMemoryToken = window.localStorage.getItem(TOKEN_KEY);
  return inMemoryToken;
};

export const setStoredToken = (token) => {
  inMemoryToken = token || null;
  if (!isBrowser) return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((requestConfig) => {
  const token = getStoredToken();
  if (token) requestConfig.headers.Authorization = `Bearer ${token}`;
  return requestConfig;
});

let isRefreshing = false;
let pendingQueue = [];

const flushQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
  pendingQueue = [];
};

/** Endpoints where a 401 is a real answer, not an expired session. */
const NO_REFRESH = ["/auth/refresh", "/auth/login", "/auth/register", "/auth/verify-otp"];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    const shouldRefresh =
      status === 401 &&
      original &&
      !original._retry &&
      !NO_REFRESH.some((path) => original.url?.includes(path));

    if (!shouldRefresh) return Promise.reject(error);

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await api.post("/auth/refresh");
      const nextToken = data?.accessToken;
      setStoredToken(nextToken);
      flushQueue(null, nextToken);
      original.headers.Authorization = `Bearer ${nextToken}`;
      return await api(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      setStoredToken(null);
      onAuthFailure?.();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
