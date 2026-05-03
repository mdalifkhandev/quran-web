import { qfConfig } from "./config";
import { QfHttpError } from "./types";
import { clearTokenCache, getAccessToken } from "./token";

type Json = Record<string, unknown>;

async function run(path: string, init?: RequestInit) {
  const token = await getAccessToken();
  const url = `${qfConfig.apiBaseUrl}${qfConfig.contentApiBasePath}${path}`;
  return fetch(url, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      "x-auth-token": token,
      "x-client-id": qfConfig.clientId,
    },
    cache: "no-store",
  });
}

function makeError(status: number, payload: unknown) {
  const message = `Quran Foundation API error (${status})`;
  return new QfHttpError(status, message, payload);
}

export async function qfFetch<T = Json>(path: string, init?: RequestInit): Promise<T> {
  let response = await run(path, init);
  if (response.status === 401) {
    clearTokenCache();
    response = await run(path, init);
  }

  if (!response.ok) {
    let payload: unknown = undefined;
    try {
      payload = await response.json();
    } catch {
      payload = await response.text();
    }
    throw makeError(response.status, payload);
  }

  return (await response.json()) as T;
}
