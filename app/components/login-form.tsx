"use client";

import { useActionState } from "react";
import { cn } from "@/app/lib/utils";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { login } from "@/app/auth-actions/actions";
import { AlertCircleIcon, PopcornIcon } from "lucide-react";
import { Alert, AlertTitle } from "@/app/components/ui/alert";

function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, action, isPending] = useActionState(login, undefined);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white dark:bg-secondary/25 dark:backdrop-blur-2xl text-card-foreground">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-base">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="h-10 bg-white dark:bg-secondary/50"
                required
              />
              {state?.errors?.email && (
                <p className="text-sm text-destructive">{state.errors.email}</p>
              )}
            </div>

            <div className="">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-xs text-primary hover:text-primary/90 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="h-10 bg-white dark:bg-secondary/50"
                required
              />
              {state?.errors?.password && (
                <p className="text-sm text-destructive">{state.errors.password}</p>
              )}
            </div>

            {state?.message && (
              <Alert variant="destructive" className="bg-destructive/15 border-0 text-red-400">
                <AlertCircleIcon />
                <AlertTitle>
                  {state.message}
                </AlertTitle>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-10 font-medium rounded-lg transition-colors"
            >
              {isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-10 bg-background border-input hover:bg-accent hover:text-accent-foreground rounded-lg"
            >
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.85 4.05-1.193 1.003-3.05 1.962-5.99 1.962-4.518 0-8.307-3.764-8.307-8.209 0-4.444 3.789-8.209 8.307-8.209 2.26 0 4.18.784 5.577 2.07l2.457-2.457C20.31 2.75 17.812 1 14.48 1 7.027 1 1 7.027 1 14.48s6.027 13.48 13.48 13.48c3.99 0 7.097-1.058 9.335-3.764 2.27-2.868 2.97-6.925 2.97-10.384 0-.64-.057-1.186-.114-1.823h-12.4z" />
              </svg>
              Google
            </Button>
            {/* <Button 
              type="button" 
              variant="outline" 
              className="h-10 border-neutral-200 hover:bg-neutral-50 rounded-lg"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 16.083c-3.038-1.425-5.205-4.291-5.205-7.663 0-.528.039-1.048.117-1.557h4.977c.119.486.197.977.197 1.474 0 1.631-.719 3.084-1.863 4.062l2.777 3.684zm5.744-9.908c0-.697-.057-1.38-.168-2.049h-11.121c.082.668.132 1.346.132 2.049 0 3.373-2.167 6.238-5.206 7.663l2.777-3.684c1.144.978 2.607 1.564 4.197 1.564 1.502 0 2.891-.459 4.056-1.237l2.777 3.684c-3.038-1.425-5.206-4.29-5.206-7.663z"/>
              </svg>
              GitHub
            </Button> */}
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="#"
            className="text-primary hover:text-primary/90 font-semibold transition-colors"
          >
            Sign up
          </Link>
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          By signing in, you agree to our{" "}
          <Link
            href="#"
            className="text-primary hover:text-primary/90 underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="text-primary hover:text-primary/90 underline"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;