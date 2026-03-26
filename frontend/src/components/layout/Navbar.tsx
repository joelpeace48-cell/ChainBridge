"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DarkModeToggle } from "./DarkModeToggle";
import { WalletConnect } from "../swap/WalletConnect";
import { Layers } from "lucide-react";

const NAV_LINKS = [
  { name: "Swap", href: "/swap" },
  { name: "Market", href: "/marketplace" },
  { name: "Explorer", href: "/transactions" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow-sm">
            <Layers className="h-5 w-5" />
          </div>
          <span className="hidden text-xl font-bold tracking-tight text-text-primary sm:block">
            ChainBridge
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-brand-500/10 text-brand-500"
                  : "text-text-secondary hover:bg-surface-overlay hover:text-text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <WalletConnect />
          <div className="h-6 w-px bg-border mx-1" />
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
}
