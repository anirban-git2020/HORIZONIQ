"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { track } from "@/lib/analytics";
import { SITE_NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";

const linkClassName =
  "text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm";

export function SiteNav({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  const handleNavClick = (href: string) => {
    track("footer_link_clicked", { link: href, surface: "header-nav" });
    setOpen(false);
  };

  return (
    <nav aria-label="Site" className={className}>
      <ul className="hidden items-center gap-5 lg:flex">
        {SITE_NAV_LINKS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={linkClassName}
              onClick={() => handleNavClick(item.href)}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="lg:hidden">
        <button
          type="button"
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-md",
            "text-muted-foreground transition-colors hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          aria-expanded={open}
          aria-controls="site-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {open && (
          <div
            id="site-mobile-nav"
            className="absolute left-0 right-0 top-full z-50 border-b border-border/60 bg-background/95 backdrop-blur-sm"
          >
            <ul className="container flex flex-col gap-1 py-3">
              {SITE_NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(linkClassName, "block px-1 py-2.5")}
                    onClick={() => handleNavClick(item.href)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
