const requiredEnvVars = [
  "JWT_SECRET",
  "DATABASE_PATH",
  "CLIENT_URL",
  "PORT",
  "RATE_LIMIT_WINDOW_MS",
  "RATE_LIMIT_MAX_REQUESTS",
  "AUTH_RATE_LIMIT_MAX_REQUESTS",
] as const;

function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0 && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}

validateEnv();

export const config = {
  env: process.env.NODE_ENV!,
  port: parseInt(process.env.PORT!, 10),

  database: {
    path: process.env.DATABASE_PATH!,
    type: process.env.DATABASE_TYPE!,
  },

  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresInMinutes: parseInt(process.env.JWT_EXPIRES_IN_MINUTES!, 10),
    expiresInSeconds: parseInt(process.env.JWT_EXPIRES_IN_MINUTES!, 10) * 60,
  },

  client: {
    url: process.env.CLIENT_URL,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS!, 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS!, 10),
    authMaxRequests: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS!, 10),
  },

  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
} as const;
