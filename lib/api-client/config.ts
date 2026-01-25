export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  tenantId: process.env.NEXT_PUBLIC_TENANT_ID || 'public',
  timeout: 30000,
} as const;
