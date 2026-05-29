'use client';

/**
 * "Or continue with" separator with styled horizontal rules.
 * A thin, elegant divider between the credential form and OAuth buttons.
 *
 * Uses semantic tokens so the background matches the card in both themes.
 */
export function OAuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-card px-3 text-muted-foreground uppercase tracking-widest font-medium">
          Or continue with
        </span>
      </div>
    </div>
  );
}
