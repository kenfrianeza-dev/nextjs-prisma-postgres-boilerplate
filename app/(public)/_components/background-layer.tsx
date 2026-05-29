/**
 * Full-screen background layer for the login page.
 * Provides the dot grid, gradient blobs, and vignette effect
 * that sit behind the main content on mobile and as a base layer on desktop.
 *
 * Fully theme-aware — uses different opacity / colour treatments
 * for light and dark modes.
 */
export function BackgroundLayer() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none bg-background">
      {/* Dot grid — light uses dark dots, dark uses light dots */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Gradient blobs — softer in light mode */}
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-blue-400/8 dark:bg-blue-600/10 blur-[100px] animate-blob" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-violet-400/6 dark:bg-violet-600/8 blur-[90px] animate-blob-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-cyan-400/5 dark:bg-cyan-500/6 blur-[80px] animate-blob-3" />

      {/* Vignette — adapts to bg colour */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_80%)]" />
    </div>
  );
}
