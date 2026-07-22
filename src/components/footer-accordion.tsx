"use client";

import { useState } from "react";

/**
 * Footer column that collapses into an accordion on mobile and shows as an
 * open column on desktop.
 */
export function FooterAccordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-ivory/10 md:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3 md:pointer-events-none md:py-0"
        aria-expanded={open}
      >
        <span className="font-heading text-sm text-ivory">{title}</span>
        <span className="font-body text-lg text-ivory/60 md:hidden">
          {open ? "−" : "+"}
        </span>
      </button>
      <div className={`${open ? "block" : "hidden"} pb-3 md:block md:pb-0`}>
        {children}
      </div>
    </div>
  );
}
