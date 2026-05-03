const qfEnv = process.env.QF_ENV ?? "prelive";

const production = {
  authBaseUrl: "https://oauth2.quran.foundation",
  apiBaseUrl: "https://apis.quran.foundation",
};

const prelive = {
  authBaseUrl: "https://prelive-oauth2.quran.foundation",
  apiBaseUrl: "https://apis-prelive.quran.foundation",
};

export const qfConfig = {
  env: qfEnv,
  clientId: process.env.QF_CLIENT_ID ?? "",
  clientSecret: process.env.QF_CLIENT_SECRET ?? "",
  ...(qfEnv === "production" ? production : prelive),
  contentApiBasePath: "/content/api/v4",
};

export function hasQfCredentials() {
  return Boolean(qfConfig.clientId && qfConfig.clientSecret);
}

export function assertQfEnv() {
  if (!hasQfCredentials()) {
    throw new Error("Quran Foundation credentials are missing. Set QF_CLIENT_ID and QF_CLIENT_SECRET.");
  }
}
