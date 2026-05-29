'use client';

import Link from 'next/link';
import { AlertCircleIcon, Loader2 } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { Alert, AlertTitle } from '@/app/_components/ui/alert';
import { PasswordInput } from '@/app/(public)/_components/password-input';
import type { LoginFormFieldsProps } from '@/app/(public)/_types';

/**
 * The credential form fields — email, password, submit button.
 * Receives action state and dispatchers from the parent orchestrator.
 */
export function LoginFormFields({ state, action, isPending }: LoginFormFieldsProps) {
  return (
    <form action={action} className="space-y-5">
      {/* Email */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-sm font-medium text-foreground/80"
        >
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="h-11 bg-transparent border-input placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring transition-all duration-200"
        />
        {state?.errors?.email && (
          <p className="text-xs text-destructive mt-1">{state.errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-foreground/80"
          >
            Password
          </Label>
          <Link
            href="#"
            className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          name="password"
          placeholder="••••••••"
          required
        />
        {state?.errors?.password && (
          <p className="text-xs text-destructive mt-1">{state.errors.password}</p>
        )}
      </div>

      {/* Error Alert */}
      {state?.message && (
        <Alert
          variant="destructive"
          className="bg-destructive/10 border-destructive/20 text-destructive"
        >
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle className="text-sm font-medium">
            {state.message}
          </AlertTitle>
        </Alert>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-11 font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  );
}
