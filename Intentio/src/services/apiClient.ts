/**
 * Axios API client — pre-configured with base URL and interceptors.
 * All API calls in services/ should use this instance.
 */
import axios, {AxiosError} from 'axios';
import {API_BASE_URL} from '../utils/constants';
import logger from '../utils/logger';

const TAG = 'ApiClient';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  config => {
    logger.debug(TAG, `→ ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    logger.error(TAG, 'Request error:', error.message);
    return Promise.reject(error);
  },
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  response => {
    logger.debug(TAG, `← ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const message = (error.response?.data as {error?: {message?: string}})
      ?.error?.message;
    logger.error(TAG, `API Error ${status}:`, message || error.message);
    return Promise.reject(error);
  },
);

export default apiClient;
