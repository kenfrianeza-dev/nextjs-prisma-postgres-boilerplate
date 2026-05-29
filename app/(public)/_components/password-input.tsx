'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/app/_components/ui/input';
import { cn } from '@/app/utils';
import { useLoginStore } from '@/app/(public)/_store/use-login-store';

/**
 * A password input with an integrated show/hide toggle button.
 * Reads visibility state from the Zustand store to stay in sync
 * with any external controls.
 */
export function PasswordInput({
  id,
  name,
  placeholder = '••••••••',
  required = false,
  className,
}: {
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  const { isPasswordVisible, togglePasswordVisibility } = useLoginStore();

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={isPasswordVisible ? 'text' : 'password'}
        placeholder={placeholder}
        required={required}
        className={cn(
          'h-11 bg-transparent border-white/[0.08] pr-10',
          'placeholder:text-muted-foreground/50',
          'focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/30',
          'transition-all duration-200',
          className,
        )}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        tabIndex={-1}
        aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
      >
        {isPasswordVisible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
