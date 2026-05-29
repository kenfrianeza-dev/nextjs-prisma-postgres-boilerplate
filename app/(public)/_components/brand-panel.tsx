import { Check } from 'lucide-react';
import { Badge } from '@/app/_components/ui/badge';

/**
 * Left-side brand panel of the split-screen login layout.
 *
 * Server component — no client interactivity needed.
 * Renders the app branding, tagline, and feature checklist
 * against a rich visual background of grid + gradient blobs.
 *
 * Intentionally always dark — this is a decorative brand panel.
 * The light/dark theme toggle affects the right (form) side only.
 */

const features = [
  'TypeScript',
  'Docker Ready',
  'Role-Based Access',
] as const;

export function BrandPanel() {
  return (
    <section className="relative hidden lg:flex lg:w-[55%] flex-col items-start justify-between p-12 xl:p-16 overflow-hidden bg-zinc-950">

      {/* ── Background layers ─────────────────────────────── */}

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Gradient mesh blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[120px] animate-blob" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-violet-600/12 blur-[100px] animate-blob-2" />
      <div className="absolute -bottom-20 left-1/4 w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[110px] animate-blob-3" />

      {/* Subtle radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgb(9_9_11)_75%)]" />

      {/* ── Content ───────────────────────────────────────── */}
      <div className="relative z-10 space-y-6">
        <Badge
          variant="outline"
          className="border-white/10 text-emerald-400/90 bg-emerald-500/10 gap-1.5 px-3 py-1 text-xs font-medium tracking-wide"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          Welcome
        </Badge>

        <div className="space-y-3">
          <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-white leading-[1.1]">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </h1>
          <p className="text-base xl:text-lg text-white/50 leading-relaxed max-w-md font-light">
            A modern, production-ready boilerplate for building full-stack web
            applications with Next.js, Prisma, and PostgreSQL.
          </p>
        </div>
      </div>

      {/* Feature checklist — anchored to bottom */}
      <div className="relative z-10">
        <div className="flex flex-wrap gap-3">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm"
            >
              <div className="flex items-center justify-center h-5 w-5 rounded-md bg-emerald-500/15">
                <Check className="h-3 w-3 text-emerald-400" />
              </div>
              <span className="text-sm text-white/70 font-medium tracking-wide">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
