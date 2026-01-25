export const AUTH_CONFIG = {
  keycloak: {
    baseUrl: process.env.NEXT_PUBLIC_LOGIN_URL || 'http://localhost:8082',
    realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'hcmute-website',
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'hcmute-website-frontend',
    get redirectUri() {
      return typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : 'http://localhost:3000/auth/callback';
    },
  },
  backend: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    tenantId: process.env.NEXT_PUBLIC_TENANT_ID || 'public',
  },
} as const;

export function buildKeycloakAuthUrl(codeChallenge: string): string {
  const { keycloak } = AUTH_CONFIG;
  const authUrl = new URL(
    `${keycloak.baseUrl}/realms/${keycloak.realm}/protocol/openid-connect/auth`
  );
  
  authUrl.searchParams.set('client_id', keycloak.clientId);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('redirect_uri', keycloak.redirectUri);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  
  return authUrl.toString();
}

export function buildKeycloakLogoutUrl(): string {
  const { keycloak } = AUTH_CONFIG;
  const logoutUrl = new URL(
    `${keycloak.baseUrl}/realms/${keycloak.realm}/protocol/openid-connect/logout`
  );
  
  logoutUrl.searchParams.set('client_id', keycloak.clientId);
  logoutUrl.searchParams.set(
    'post_logout_redirect_uri',
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  );
  
  return logoutUrl.toString();
}
