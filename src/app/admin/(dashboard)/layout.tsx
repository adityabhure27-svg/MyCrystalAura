import Link from "next/link";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { requireOwner } from "@/lib/auth";
import { Logo } from "@/components/logo";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOwner();

  return (
    <div className="flex min-h-screen bg-ivory">
      {/* Dark portal sidebar — visually separate from the public site */}
      <aside className="hidden w-60 shrink-0 flex-col bg-navy text-ivory md:flex">
        <div className="border-b border-ivory/10 px-5 py-5">
          <Logo tone="light" />
          <p className="eyebrow mt-3 text-gold-soft">Admin Portal</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 font-body text-sm text-ivory/75 transition-colors hover:bg-navy-700 hover:text-ivory"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-ivory/10 p-3">
          <SignOutButton>
            <button
              type="button"
              className="w-full rounded-lg px-3 py-2 text-left font-body text-sm text-ivory/60 transition-colors hover:text-ivory"
            >
              Sign out
            </button>
          </SignOutButton>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-gold/15 bg-cream px-6">
          <div className="md:hidden">
            <Logo />
          </div>
          <span className="hidden font-body text-sm text-slate md:block">
            MyCrystalAura — Control Center
          </span>
          <UserButton />
        </header>
        <div className="flex-1 p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
