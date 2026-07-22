import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { adminSignIn } from "./actions";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

const inputClass =
  "mt-1.5 w-full rounded-brand border border-gold/25 bg-white px-4 py-3 font-body text-sm text-navy outline-none focus:border-gold";

export default async function AdminSignInPage(
  props: PageProps<"/admin/sign-in">,
) {
  const sp = await props.searchParams;
  const invalid = sp?.error === "invalid";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-navy px-5 py-16">
      <div className="text-center">
        <Logo tone="light" />
        <p className="eyebrow mt-4 text-gold-soft">Admin Access</p>
      </div>

      <form
        action={adminSignIn}
        className="w-full max-w-sm rounded-brand bg-cream p-8 shadow-2xl"
      >
        <h1 className="text-center font-heading text-xl text-navy">
          Owner sign in
        </h1>

        {invalid && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center font-body text-sm text-red-700">
            Invalid email or password.
          </p>
        )}

        <label className="mt-5 block font-body text-sm text-navy">
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="username"
            className={inputClass}
          />
        </label>

        <label className="mt-4 block font-body text-sm text-navy">
          Password
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className={inputClass}
          />
        </label>

        <button
          type="submit"
          className="mt-6 w-full rounded-brand bg-navy px-6 py-3 font-body text-sm font-semibold text-ivory transition-colors hover:bg-navy-700"
        >
          Sign in
        </button>
      </form>

      <p className="font-body text-xs text-ivory/50">
        Authorized personnel only.
      </p>
    </div>
  );
}
