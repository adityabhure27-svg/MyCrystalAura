const ITEMS = [
  "Free shipping on orders above ₹999",
  "100% Natural Crystals",
  "Ethically Sourced",
];

export function AnnouncementBar() {
  return (
    <div className="bg-navy text-ivory">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-1 px-5 py-2 text-center font-body text-[11px] uppercase tracking-[0.15em] text-ivory/80">
        {ITEMS.map((item, i) => (
          <span key={item} className="flex items-center gap-8">
            {i > 0 && <span className="text-gold/60">·</span>}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
