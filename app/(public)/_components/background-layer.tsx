/**
 * Full-screen background layer for the login page.
 * Provides the dot grid, gradient blobs, and vignette effect
 * that sit behind the main content on mobile and as a base layer on desktop.
 */
export function BackgroundLayer() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#030712]">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Gradient blobs */}
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px] animate-blob" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-violet-600/8 blur-[90px] animate-blob-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-cyan-500/6 blur-[80px] animate-blob-3" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030712_80%)]" />
    </div>
  );
}
