import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "lime" | "outline" | "ghost" | "ink";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium text-xs transition-all duration-200 active:scale-[0.97] active:transition-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-lime/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 rounded-control";

const variants: Record<Variant, string> = {
  lime: "bg-lime text-on-lime hover:bg-lime-hover shadow-[0_8px_24px_-12px_rgba(204,255,0,0.45)]",
  outline:
    "border border-border-strong bg-surface/40 text-foreground hover:bg-surface-2 hover:border-border-strong",
  ghost: "text-secondary hover:text-foreground hover:bg-surface-2",
  ink: "bg-foreground text-background hover:bg-foreground/90",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3",
  md: "h-10 px-4",
  lg: "h-11 px-5 text-[13px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; external?: boolean };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = "outline", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { href, external, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    void _v;
    void _s;
    void _c;
    void _ch;
    const isExternal = external ?? /^https?:|^mailto:/.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;
  void _v;
  void _s;
  void _c;
  void _ch;
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
