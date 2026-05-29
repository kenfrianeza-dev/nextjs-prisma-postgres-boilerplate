/**
 * Shared types for the Login module.
 * Centralised here to follow the DRY principle — every component,
 * store, and hook imports from this single source.
 */

// ─── Form State ──────────────────────────────────────────────

export type LoginFormState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
} | undefined;

// ─── Component Props ─────────────────────────────────────────

export interface LoginCardProps {
  className?: string;
}

export interface LoginFormFieldsProps {
  state: LoginFormState;
  action: (payload: FormData) => void;
  isPending: boolean;
}

export interface OAuthSectionProps {
  className?: string;
}

export interface BrandPanelProps {
  className?: string;
}

export interface PasswordInputProps {
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}
