import { saveCrystal } from "@/app/admin/(dashboard)/crystals/actions";
import type { CrystalProfile } from "@/lib/database.types";

const input =
  "mt-1.5 w-full rounded-brand border border-gold/25 bg-white/70 px-3 py-2 font-body text-sm text-navy outline-none focus:border-gold";

function Field({
  name,
  label,
  value,
  area,
}: {
  name: string;
  label: string;
  value: string | null | undefined;
  area?: boolean;
}) {
  return (
    <label className="block font-body text-sm text-navy">
      {label}
      {area ? (
        <textarea name={name} rows={3} defaultValue={value ?? ""} className={input} />
      ) : (
        <input name={name} defaultValue={value ?? ""} className={input} />
      )}
    </label>
  );
}

function Group({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-brand border border-gold/20 bg-white/50 p-5">
      <legend className="px-1 font-heading text-sm text-navy">{title}</legend>
      {note && <p className="mb-3 font-body text-xs text-slate">{note}</p>}
      <div className="grid gap-4">{children}</div>
    </fieldset>
  );
}

export function CrystalForm({ crystal }: { crystal?: CrystalProfile | null }) {
  const c = crystal;
  return (
    <form action={saveCrystal} className="max-w-2xl">
      {c && <input type="hidden" name="id" value={c.id} />}

      <div className="grid gap-5">
        <Group title="Basic">
          <div className="grid grid-cols-2 gap-4">
            <label className="font-body text-sm text-navy">
              Name
              <input name="name" required defaultValue={c?.name ?? ""} className={input} />
            </label>
            <label className="font-body text-sm text-navy">
              Status
              <select name="status" defaultValue={c?.status ?? "draft"} className={input}>
                <option value="draft">Draft (hidden)</option>
                <option value="published">Published (live)</option>
              </select>
            </label>
          </div>
          <Field name="overview" label="Overview" value={c?.overview} area />
        </Group>

        <Group title="Scientific information" note="Verified facts — mineralogy & geology.">
          <Field name="scientific_information" label="Scientific information" value={c?.scientific_information} area />
          <Field name="geological_formation" label="Formation" value={c?.geological_formation} />
          <Field name="origin" label="Origin / localities" value={c?.origin} />
          <Field name="colour_variations" label="Colour variations" value={c?.colour_variations} />
        </Group>

        <Group title="Traditional & spiritual" note="Cultural beliefs — clearly labelled on the site, not medical claims.">
          <Field name="traditional_properties" label="Traditional associations" value={c?.traditional_properties} area />
          <Field name="chakra_association" label="Chakra" value={c?.chakra_association} />
          <Field name="zodiac_association" label="Zodiac" value={c?.zodiac_association} />
        </Group>

        <Group title="Care">
          <Field name="care_instructions" label="Care instructions" value={c?.care_instructions} area />
          <Field name="cleansing_methods" label="Cleansing methods" value={c?.cleansing_methods} area />
          <Field name="charging_methods" label="Charging methods" value={c?.charging_methods} area />
        </Group>

        <Group title="Buying guide">
          <Field name="buying_guide" label="Buying guide" value={c?.buying_guide} area />
        </Group>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="rounded-brand bg-navy px-6 py-2.5 font-body text-sm font-semibold text-ivory hover:bg-navy-700"
        >
          {c ? "Save changes" : "Create crystal"}
        </button>
      </div>
    </form>
  );
}
