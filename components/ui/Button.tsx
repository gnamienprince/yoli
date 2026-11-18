import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'light' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  light: 'btn-light',
  ghost: 'btn-ghost',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-6 py-2.5 text-[0.65rem]',
  md: 'px-10 py-4 text-xs',
  lg: 'px-12 py-5 text-sm',
};

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  className?: string;
}

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
  };

type ButtonAsAnchor = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

/**
 * Polymorphic button. Maps to the .btn-* component classes from globals.css,
 * overriding padding/size per the `size` prop. Renders an <a> when `href` is
 * provided (or when asChild is set and an href exists), otherwise a <button>.
 */
export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  { variant = 'primary', size = 'md', asChild = false, className, ...props },
  ref
) {
  // ghost has no built-in padding, so size padding only applies to the others.
  const classes = cn(
    variantClasses[variant],
    variant !== 'ghost' && sizeClasses[size],
    className
  );

  // Slot-like behaviour: render an <a> whenever an href is present — this also
  // covers the asChild case (used to wrap link-like children such as next Link).
  // Without an href we always fall back to a native <button>. asChild is accepted
  // for API compatibility; in this simple variant href alone determines the tag.
  void asChild;
  const isLink = 'href' in props && props.href !== undefined;

  if (isLink) {
    const { href, ...anchorProps } =
      props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...anchorProps}
      />
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
});
