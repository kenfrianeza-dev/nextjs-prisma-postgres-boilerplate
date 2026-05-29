'use client';

/**
 * "Or continue with" separator with styled horizontal rules.
 * A thin, elegant divider between the credential form and OAuth buttons.
 */
export function OAuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/[0.06]" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-[#030712] px-3 text-muted-foreground/60 uppercase tracking-widest font-medium">
          Or continue with
        </span>
      </div>
    </div>
  );
}
