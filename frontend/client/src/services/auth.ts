/**
 * Serviço de autenticação
 * Implementa login, registro, logout e refresh de token
 */

import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserContextResponse,
} from "@/types/api";
import { apiPost, apiGet, storeTokens, clearTokens } from "@/services/api";

// ============================================================================
// LOGIN
// ============================================================================

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await apiPost<AuthResponse>("/api/auth/login", credentials);

  if (response.accessToken && response.refreshToken) {
    storeTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
  }

  return response;
}

// ============================================================================
// REGISTRO
// ============================================================================

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiPost<AuthResponse>("/api/auth/register", data);

  if (response.accessToken && response.refreshToken) {
    storeTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
  }

  return response;
}

// ============================================================================
// OBTER USUÁRIO ATUAL
// ============================================================================

export async function getCurrentUser(): Promise<UserContextResponse> {
  return apiGet<UserContextResponse>("/api/auth/me");
}

// ============================================================================
// LOGOUT
// ============================================================================

export async function logout(): Promise<void> {
  try {
    await apiPost("/api/auth/logout", {});
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    clearTokens();
  }
}

// ============================================================================
// REFRESH TOKEN
// ============================================================================

export async function refreshAccessToken(
  refreshToken: string
): Promise<AuthResponse> {
  const response = await apiPost<AuthResponse>("/api/auth/refresh", {
    refreshToken,
  });

  if (response.accessToken && response.refreshToken) {
    storeTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
  }

  return response;
}

// ============================================================================
// GOOGLE OAUTH
// ============================================================================

export async function googleCallback(code: string): Promise<AuthResponse> {
  const response = await apiPost<AuthResponse>("/api/auth/google/callback", {
    code,
  });

  if (response.accessToken && response.refreshToken) {
    storeTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
  }

  return response;
}

// ============================================================================
// PASSWORD RESET
// ============================================================================

export async function forgotPassword(email: string): Promise<void> {
  await apiPost("/api/account/password/forgot", { email });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await apiPost("/api/account/password/reset", {
    token,
    password: newPassword,
  });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await apiPost("/api/account/password/change", {
    currentPassword,
    newPassword,
  });
}

// ============================================================================
// EMAIL VERIFICATION
// ============================================================================

export async function verifyEmail(token: string): Promise<void> {
  await apiGet(`/api/auth/verify-email?token=${token}`);
}

export async function resendVerificationEmail(email: string): Promise<void> {
  await apiPost("/api/auth/resend-verification", { email });
}
