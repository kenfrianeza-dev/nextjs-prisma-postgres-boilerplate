import { LoginForm } from "@/app/components";
import { Separator } from "@/app/components/ui";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await verifySession();
  if (session) redirect('/dashboard');

  return (
    <div className="relative min-w-[320px] min-h-svh flex flex-col bg-background sm:bg-muted/30 sm:flex-row overflow-hidden">

      {/* Background Patterns */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-20">
        {/* Grid Pattern (SVG) */}
        <div
          className="absolute inset-0 bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='72' height='72' fill='none' stroke='rgb(15 23 42 / 0.02)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
            // Background image for dark mode (lighter stroke)
          }}
        ></div>

        {/* Dark Mode Grid Pattern (Separate for easier theme handling if needed, or use CSS var in SVG) */}
        <div
          className="absolute inset-0 bg-center dark:block hidden mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='72' height='72' fill='none' stroke='rgb(255 255 255 / 0.02)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
          }}
        ></div>

        {/* Soft Blobs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:mix-blend-normal dark:bg-primary/10"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500/20 mix-blend-multiply filter blur-3xl opacity-30 animate-blob-2 dark:mix-blend-normal dark:bg-blue-500/10"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-500/20 mix-blend-multiply filter blur-3xl opacity-30 animate-blob-3 dark:mix-blend-normal dark:bg-purple-500/10"></div>
      </div>

      <div className="absolute top-4 right-4 z-50">
        {/* Add theme toggle here locally if needed, or rely on system/layout */}
      </div>

      {/* LEFT / TOP (Brand) */}
      <section className="relative flex flex-col items-center justify-center p-8 sm:w-1/2 sm:justify-center sm:items-start shadow-lg z-10 bg-background/80 backdrop-blur-sm sm:bg-transparent sm:shadow-none">
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-xs font-medium text-primary">Welcome</span>
            </div>
            <h1 className="text-5xl font-bold text-foreground leading-tight">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A modern, production-ready boilerplate for building full-stack web applications with Next.js, Prisma, and PostgreSQL.
          </p>
          <div className="flex gap-4 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-foreground">TypeScript</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-foreground">Docker Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEPARATOR (desktop only) */}
      <Separator
        orientation="vertical"
        className="hidden sm:block w-px bg-border z-10"
      />

      {/* RIGHT / BOTTOM (Login) */}
      <section className="relative flex items-center justify-center p-6 sm:w-1/2 bg-background backdrop-blur-sm z-10">
        <LoginForm className="w-full max-w-sm" />
      </section>

    </div>
  );
}
