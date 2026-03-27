/**
 * Configuração centralizada de variáveis de ambiente.
 * Toda leitura de import.meta.env deve passar por aqui.
 */

export const env = {
  /** Base URL do backend Spring Boot */
  API_BASE_URL: import.meta.env.VITE_FRONTEND_FORGE_API_URL || "https://continuum-backend.onrender.com",

  /** Chave de API do Google Maps */
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_FRONTEND_FORGE_API_KEY || "",

  /** URL do portal OAuth */
  OAUTH_PORTAL_URL: import.meta.env.VITE_OAUTH_PORTAL_URL || "",

  /** ID da aplicação registrada no OAuth server */
  APP_ID: import.meta.env.VITE_APP_ID || "",

  /** Título da aplicação */
  APP_TITLE: import.meta.env.VITE_APP_TITLE || "Continuum",

  /** Logo da aplicação (URL CDN) */
  APP_LOGO: import.meta.env.VITE_APP_LOGO || "",

  /** Google Maps Map ID */
  GOOGLE_MAP_ID: import.meta.env.VITE_GOOGLE_MAP_ID || "DEMO_MAP_ID",
} as const;
