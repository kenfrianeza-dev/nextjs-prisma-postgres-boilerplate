import { LoginForm } from "@/app/components/login-form";
import { Separator } from "@/app/components/ui";

export default function Home() {
  return (
    <div className="min-w-[320px] min-h-svh flex flex-col bg-white sm:bg-slate-50 sm:flex-row">

      {/* LEFT / TOP (Brand) */}
      <section className="flex flex-col items-center justify-center p-8 sm:w-1/2 sm:justify-center sm:items-start shadow-lg">
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-slate-200 px-3 py-1 rounded-full border border-slate-200">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <span className="text-xs font-medium text-slate-600">Welcome</span>
            </div>
            <h1 className="text-5xl font-bold text-blue-600 leading-tight">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </h1>
          </div>
          <p className="text-lg text-slate-700 leading-relaxed">
            A modern, production-ready boilerplate for building full-stack web applications with Next.js, Prisma, and PostgreSQL.
          </p>
          <div className="flex gap-4 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-slate-200 border border-slate-200 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-slate-700">TypeScript</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-slate-200 border border-slate-200 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-slate-700">Docker Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEPARATOR (desktop only) */}
      <Separator
        orientation="vertical"
        className="hidden sm:block w-px bg-slate-200"
      />

      {/* RIGHT / BOTTOM (Login) */}
      <section className="lg:shadow-lg flex items-center justify-center p-6 sm:w-1/2 bg-white">
        <LoginForm className="w-full max-w-sm" />
      </section>

    </div>
  );
}
