import { assertQfEnv, qfConfig } from "./config";

type TokenCache = { token: string; expiresAt: number } | null;
let tokenCache: TokenCache = null;

export function clearTokenCache() {
  tokenCache = null;
}

export async function getAccessToken() {
  assertQfEnv();
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt - 20_000 > now) return tokenCache.token;

  const auth = Buffer.from(`${qfConfig.clientId}:${qfConfig.clientSecret}`).toString("base64");
  const res = await fetch(`${qfConfig.authBaseUrl}/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=content",
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`OAuth token request failed: ${res.status}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  tokenCache = { token: json.access_token, expiresAt: now + json.expires_in * 1000 };
  return tokenCache.token;
}
