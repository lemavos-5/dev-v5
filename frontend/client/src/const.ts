export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { env } from "@/config/env";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${env.OAUTH_PORTAL_URL}/app-auth`);
  url.searchParams.set("appId", env.APP_ID);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
