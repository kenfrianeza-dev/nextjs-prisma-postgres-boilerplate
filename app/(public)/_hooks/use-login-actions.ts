'use client';

import { useActionState } from 'react';
import { login } from '@/app/auth-actions/actions';
import type { LoginFormState } from '@/app/(public)/_types';

/**
 * Custom hook that encapsulates all server-action wiring for login.
 *
 * Returns action dispatchers and pending flags that components can
 * consume without knowing the underlying useActionState plumbing.
 */
export function useLoginActions() {
  const [state, action, isPending] = useActionState<LoginFormState, FormData>(
    login,
    undefined,
  );

  return {
    state,
    action,
    isPending,
  };
}
