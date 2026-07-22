import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { requireOwner } from "@/lib/auth";

const NAV = [
  { href: "/owner", label: "Dashboard" },
  { href: "/owner/products", label: "Products" },
  { href: "/owner/categories", label: "Categories" },
  { href: "/owner/orders", label: "Orders" },
  { href: "/owner/customers", label: "Customers" },
  { href: "/owner/analytics", label: "Analytics" },
];

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOwner();

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-5 py-8">
      <aside className="hidden w-52 shrink-0 md:block">
        <p className="eyebrow">Owner Portal</p>
        <nav className="mt-5 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 font-body text-sm text-navy/80 transition-colors hover:bg-ivory-deep hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6">
          <SignOutButton>
            <button
              type="button"
              className="rounded-lg px-3 py-2 font-body text-sm text-slate hover:text-navy"
            >
              Sign out
            </button>
          </SignOutButton>
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
