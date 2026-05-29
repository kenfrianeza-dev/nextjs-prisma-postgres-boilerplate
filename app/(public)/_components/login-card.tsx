'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/app/_components/ui/card';
import { useLoginActions } from '@/app/(public)/_hooks/use-login-actions';
import { LoginFormFields } from '@/app/(public)/_components/login-form-fields';
import { OAuthDivider } from '@/app/(public)/_components/oauth-divider';
import { GoogleOAuthButton } from '@/app/(public)/_components/google-oauth-button';

/**
 * The login card — the right-side content of the split-screen layout.
 * 
 * Orchestrates the form fields, OAuth section, and footer links.
 * All state lives in the Zustand store and the useLoginActions hook;
 * this component wires them together without prop-drilling.
 */
export function LoginCard({ className }: { className?: string }) {
  const { state, action, isPending } = useLoginActions();

  return (
    <div className={className}>
      <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-black/20">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome back
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-0">
          <LoginFormFields
            state={state}
            action={action}
            isPending={isPending}
          />

          <OAuthDivider />

          <GoogleOAuthButton />

          {/* Footer links */}
          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
            <p className="text-xs text-muted-foreground/70 leading-relaxed">
              By signing in, you agree to our{' '}
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors duration-200"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
