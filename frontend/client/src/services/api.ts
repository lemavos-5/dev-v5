/**
 * Serviço Axios centralizado com interceptors para JWT
 * Implementa token rotation automática e tratamento de erros
 */

import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { ApiErrorClass } from "@/types/api";
import { env } from "@/config/env";

// ============================================================================
// TIPOS
// ============================================================================

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface PendingRequest {
  config: any;
  resolve: (value: AxiosResponse | Promise<AxiosResponse>) => void;
  reject: (reason?: any) => void;
}

// ============================================================================
// ESTADO GLOBAL
// ============================================================================

let isRefreshing = false;
let failedQueue: PendingRequest[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(api.request(prom.config) as Promise<AxiosResponse>);
    }
  });

  isRefreshing = false;
  failedQueue = [];
};

// ============================================================================
// INSTÂNCIA AXIOS
// ============================================================================

export const api: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================================
// INTERCEPTOR DE REQUEST
// ============================================================================

api.interceptors.request.use(
  (config) => {
    const tokens = getStoredTokens();
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================================
// INTERCEPTOR DE RESPONSE
// ============================================================================

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Se erro é 403, abre modal de upgrade
    if (error.response?.status === 403) {
      try {
        const { useUIStore } = await import("@/stores/uiStore");
        const { setUpgradeModalOpen } = useUIStore.getState();
        setUpgradeModalOpen(true);
      } catch (e) {
        console.error("Error opening upgrade modal:", e);
      }
      return Promise.reject(
        new ApiErrorClass(
          403,
          "Plan limit exceeded",
          (error.response?.data as any)?.details
        )
      );
    }

    // Se não for 401 ou já tentou refresh, rejeita
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(
        new ApiErrorClass(
          error.response?.status || 500,
          error.response?.statusText || "Unknown error",
          (error.response?.data as any)?.details
        )
      );
    }

    // Se já está refrescando, adiciona à fila
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          config: originalRequest,
          resolve,
          reject,
        });
      });
    }

    // Marca como refrescando e tenta renovar token
    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const tokens = getStoredTokens();
      if (!tokens?.refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post(`${env.API_BASE_URL}/api/auth/refresh`, {
        refreshToken: tokens.refreshToken,
      });

      const newTokens: TokenPair = {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };

      storeTokens(newTokens);
      api.defaults.headers.common.Authorization = `Bearer ${newTokens.accessToken}`;

      processQueue(null, newTokens.accessToken);

      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
      return api(originalRequest);
    } catch (err) {
      processQueue(err as AxiosError);
      clearTokens();
      window.location.href = "/login";
      return Promise.reject(err);
    }
  }
);

// ============================================================================
// GERENCIAMENTO DE TOKENS
// ============================================================================

const TOKEN_KEY = "continuum_tokens";

export function storeTokens(tokens: TokenPair): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

export function getStoredTokens(): TokenPair | null {
  const stored = localStorage.getItem(TOKEN_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function hasValidToken(): boolean {
  const tokens = getStoredTokens();
  return !!tokens?.accessToken;
}

// ============================================================================
// MÉTODOS DE REQUISIÇÃO TIPADOS
// ============================================================================

export async function apiGet<T>(url: string, config?: any): Promise<T> {
  const response = await api.get<T>(url, config);
  return response.data;
}

export async function apiPost<T>(url: string, data?: any, config?: any): Promise<T> {
  const response = await api.post<T>(url, data, config);
  return response.data;
}

export async function apiPut<T>(url: string, data?: any, config?: any): Promise<T> {
  const response = await api.put<T>(url, data, config);
  return response.data;
}

export async function apiDelete<T>(url: string, config?: any): Promise<T> {
  const response = await api.delete<T>(url, config);
  return response.data;
}

export async function apiPatch<T>(url: string, data?: any, config?: any): Promise<T> {
  const response = await api.patch<T>(url, data, config);
  return response.data;
}

export default api;
