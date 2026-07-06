"use client";

import Link from "next/link";

import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type FooterLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  surface?: string;
  external?: boolean;
};

export function FooterLink({
  href,
  children,
  className,
  surface = "footer",
  external = false,
}: FooterLinkProps) {
  const handleClick = () => {
    track("footer_link_clicked", { link: href, surface });
  };

  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}

type FooterTextLinkProps = {
  href: string;
  label: string;
  surface?: string;
  external?: boolean;
};

export function FooterTextLink({
  href,
  label,
  surface = "footer",
  external = false,
}: FooterTextLinkProps) {
  return (
    <FooterLink
      href={href}
      surface={surface}
      external={external}
      className={cn(
        "text-sm text-muted-foreground transition-colors hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
      )}
    >
      {label}
    </FooterLink>
  );
}
