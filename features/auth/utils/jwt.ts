import type { JwtUserProfile } from '../types';

export function parseJwt(token: string): JwtUserProfile | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, bufferSeconds = 60): boolean {
  const payload = parseJwt(token);
  if (!payload?.exp) return true;
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now + bufferSeconds;
}

export function getTokenExpiration(token: string): Date | null {
  const payload = parseJwt(token);
  if (!payload?.exp) return null;
  
  return new Date(payload.exp * 1000);
}
