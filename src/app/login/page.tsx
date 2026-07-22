import type { Metadata } from "next";
import { signIn } from "./actions";

export const metadata: Metadata = { title: "Owner Login" };

export default async function LoginPage(props: PageProps<"/login">) {
  const sp = await props.searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/owner";
  const errorParam = typeof sp.error === "string" ? sp.error : null;
  const error =
    errorParam === "not_owner"
      ? "That account isn’t an owner. Ask an owner to grant you access."
      : errorParam;

  return (
    <section className="mx-auto flex max-w-md flex-col px-5 py-20">
      <p className="eyebrow text-center">Owner Portal</p>
      <h1 className="mt-3 text-center text-3xl text-navy">Sign in</h1>

      {error && (
        <p className="mt-6 rounded-brand border border-gold/40 bg-white/70 px-4 py-3 text-center font-body text-sm text-navy">
          {error}
        </p>
      )}

      <form action={signIn} className="mt-8 flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />
        <label className="font-body text-sm text-navy">
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="mt-1.5 w-full rounded-brand border border-gold/25 bg-white/70 px-4 py-3 font-body text-sm text-navy outline-none focus:border-gold"
          />
        </label>
        <label className="font-body text-sm text-navy">
          Password
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="mt-1.5 w-full rounded-brand border border-gold/25 bg-white/70 px-4 py-3 font-body text-sm text-navy outline-none focus:border-gold"
          />
        </label>
        <button
          type="submit"
          className="mt-2 rounded-brand bg-navy px-6 py-3 font-body text-sm font-semibold text-ivory transition-colors hover:bg-navy-700"
        >
          Sign in
        </button>
      </form>

      <p className="mt-6 text-center font-body text-xs text-slate">
        Owner accounts are created in Supabase. After signing up, set
        <code className="mx-1 rounded bg-ivory-deep px-1.5 py-0.5">
          profiles.role = &apos;owner&apos;
        </code>
        for your account.
      </p>
    </section>
  );
}
