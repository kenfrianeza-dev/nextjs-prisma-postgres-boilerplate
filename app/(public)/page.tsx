import { redirect } from 'next/navigation';
import { verifySession } from '@/lib/auth';
import { BrandPanel } from '@/app/(public)/_components/brand-panel';
import { MobileBrandHeader } from '@/app/(public)/_components/mobile-brand-header';
import { BackgroundLayer } from '@/app/(public)/_components/background-layer';
import { LoginCard } from '@/app/(public)/_components/login-card';

export default async function LoginPage() {
  const session = await verifySession();
  if (session) redirect('/dashboard');

  return (
    <div className="relative min-h-svh flex flex-col lg:flex-row bg-background text-foreground overflow-hidden">
      {/* Full-screen background (visible on mobile, underneath brand panel on desktop) */}
      <BackgroundLayer />

      {/* ── LEFT: Brand Panel (desktop only, always dark) ── */}
      <BrandPanel />

      {/* ── RIGHT: Login Form ───────────────────────────── */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-10 lg:px-12 lg:py-0">
        {/* Subtle left edge accent on desktop */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-border to-transparent" />

        {/* Mobile brand header (hidden on lg+) */}
        <MobileBrandHeader />

        {/* Login card */}
        <LoginCard className="w-full max-w-[420px]" />
      </section>
    </div>
  );
}
