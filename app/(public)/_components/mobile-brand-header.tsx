import { Check } from 'lucide-react';
import { Badge } from '@/app/_components/ui/badge';

/**
 * Mobile-only brand header shown above the login card on small screens.
 * A compact version of the BrandPanel for responsive stacking.
 *
 * Fully theme-aware — uses semantic tokens so it adapts to light/dark.
 */

const features = ['TypeScript', 'Docker Ready', 'Role-Based Access'] as const;

export function MobileBrandHeader() {
  return (
    <div className="lg:hidden px-6 pt-10 pb-4 space-y-4">
      <Badge
        variant="outline"
        className="border-emerald-500/20 text-emerald-600 dark:text-emerald-400/90 bg-emerald-500/10 gap-1.5 px-3 py-1 text-xs font-medium tracking-wide"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 dark:bg-emerald-400" />
        </span>
        Welcome
      </Badge>

      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {process.env.NEXT_PUBLIC_APP_NAME}
      </h1>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-sm font-light">
        A modern, production-ready boilerplate for building full-stack web
        applications.
      </p>

      <div className="flex flex-wrap gap-2 pt-1">
        {features.map((feature) => (
          <div
            key={feature}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-muted/50 border border-border"
          >
            <div className="flex items-center justify-center h-4 w-4 rounded bg-emerald-500/15">
              <Check className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
