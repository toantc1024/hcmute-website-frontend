export interface JwtUserProfile {
  sub: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  exp?: number;
  iat?: number;
  realm_access?: {
    roles?: string[];
  };
  [key: string]: unknown;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: JwtUserProfile | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface AuthActions {
  initiateLogin: () => Promise<void>;
  handleCallback: (code: string) => Promise<JwtUserProfile | null>;
  refreshSession: () => Promise<boolean>;
  logout: () => void;
  forceLogout: () => void;
  getAccessToken: () => Promise<string | null>;
  clearError: () => void;
  setInitialized: () => void;
}

export type AuthStore = AuthState & AuthActions;
