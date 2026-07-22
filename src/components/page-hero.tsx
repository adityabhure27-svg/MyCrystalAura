export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-gold/15 bg-ivory-deep/40">
      <div className="mx-auto max-w-4xl px-5 py-16 text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 text-4xl text-navy sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-2xl font-body text-lg leading-relaxed text-slate">
          {description}
        </p>
      </div>
    </section>
  );
}
