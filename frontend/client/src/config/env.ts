/// <reference types="vite/client" />

import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_FRONTEND_FORGE_API_KEY: z.string().min(1),
  VITE_OAUTH_PORTAL_URL: z.string().url(),
  VITE_APP_ID: z.string().min(1),
  VITE_APP_TITLE: z.string().default("Continuum"),
  VITE_APP_LOGO: z.string().url().optional(),
  VITE_GOOGLE_MAP_ID: z.string().default("DEMO_MAP_ID"),
  VITE_ANALYTICS_ENDPOINT: z.string().url().optional(),
  VITE_ANALYTICS_WEBSITE_ID: z.string().optional(),
});

const rawEnv = {
  VITE_API_URL:
    import.meta.env.VITE_API_URL || import.meta.env.VITE_FRONTEND_FORGE_API_URL,
  VITE_FRONTEND_FORGE_API_KEY: import.meta.env.VITE_FRONTEND_FORGE_API_KEY,
  VITE_OAUTH_PORTAL_URL: import.meta.env.VITE_OAUTH_PORTAL_URL,
  VITE_APP_ID: import.meta.env.VITE_APP_ID,
  VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
  VITE_APP_LOGO: import.meta.env.VITE_APP_LOGO,
  VITE_GOOGLE_MAP_ID: import.meta.env.VITE_GOOGLE_MAP_ID,
  VITE_ANALYTICS_ENDPOINT: import.meta.env.VITE_ANALYTICS_ENDPOINT,
  VITE_ANALYTICS_WEBSITE_ID: import.meta.env.VITE_ANALYTICS_WEBSITE_ID,
};

const parseResult = envSchema.safeParse(rawEnv);

if (!parseResult.success) {
  const errors = parseResult.error.errors
    .map((error) => `- ${error.path.join(".")}: ${error.message}`)
    .join("\n");
  throw new Error(`Missing or invalid environment variables:\n${errors}`);
}

const envValues = parseResult.data;

export const env = {
  API_BASE_URL: envValues.VITE_API_URL,
  GOOGLE_MAPS_API_KEY: envValues.VITE_FRONTEND_FORGE_API_KEY,
  OAUTH_PORTAL_URL: envValues.VITE_OAUTH_PORTAL_URL,
  APP_ID: envValues.VITE_APP_ID,
  APP_TITLE: envValues.VITE_APP_TITLE,
  APP_LOGO: envValues.VITE_APP_LOGO ?? "",
  GOOGLE_MAP_ID: envValues.VITE_GOOGLE_MAP_ID,
  ANALYTICS_ENDPOINT: envValues.VITE_ANALYTICS_ENDPOINT,
  ANALYTICS_WEBSITE_ID: envValues.VITE_ANALYTICS_WEBSITE_ID,
} as const;
