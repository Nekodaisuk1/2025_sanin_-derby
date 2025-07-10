import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function Button(
  { className, ...props }, ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        'px-3 py-1 rounded border bg-blue-600 text-white disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
});
