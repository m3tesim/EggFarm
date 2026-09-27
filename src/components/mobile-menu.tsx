"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/navigation";

type Props = {
  links: { href: string; label: string }[];
  openLabel: string;
  closeLabel: string;
};

export function MobileMenu({ links, openLabel, closeLabel }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? closeLabel : openLabel}
        aria-expanded={open}
        className="grid size-10 place-items-center rounded-full text-bark-700 hover:bg-cream-200"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && (
        <nav className="absolute inset-x-0 top-16 border-b border-bark-900/10 bg-cream-50 px-4 py-3 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 font-medium text-bark-700 hover:bg-cream-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
