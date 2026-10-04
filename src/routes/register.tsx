import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Gift, Loader2 } from "lucide-react";
import { BRANCHES, COLLEGES, YEARS, getForm, getIncomingRef, isValidIndianPhone, normalizePhone, registerStudent } from "@/lib/api";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Reserve your free seat — Project Roulette" },
      { name: "description", content: "Register for NxtWave's free workshop: Build Your First AI Project in 60 Minutes." },
      { property: "og:title", content: "Reserve your free seat — Build Your First AI Project in 60 Minutes" },
      { property: "og:description", content: "Free. 60 minutes. No coding experience needed." },
    ],
  }),
  component: RegisterPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  college: z.string().trim().min(2, "Pick or type your college").max(120),
  branch: z.string().min(1, "Pick your branch"),
  year: z.string().min(1),
  phone: z.string().refine((p) => isValidIndianPhone(normalizePhone(p)) && normalizePhone(p).length === 10, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().email("Enter a valid email").max(255),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;
const field = "h-12 w-full rounded-xl border border-input bg-secondary px-3 text-foreground outline-none focus:ring-2 focus:ring-ring";

function RegisterPage() {
  const navigate = useNavigate();
  const [ref, setRef] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [collegeQuery, setCollegeQuery] = useState("");
  const [college, setCollege] = useState("");
  const [otherCollege, setOtherCollege] = useState(false);
  const [open, setOpen] = useState(false);
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("Final year");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [optIn, setOptIn] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setRef(getIncomingRef());
    const f = getForm();
    if (f?.["branch"]) setBranch(f["branch"]);
  }, []);

  const matches = useMemo(() => COLLEGES.filter((c) => c.toLowerCase().includes(collegeQuery.toLowerCase())).slice(0, 8), [collegeQuery]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCollege = otherCollege ? collegeQuery : college;
    const res = schema.safeParse({ name, college: finalCollege, branch, year, phone, email });
    if (!res.success) {
      const errs: Errors = {};
      for (const i of res.error.issues) errs[i.path[0] as keyof Errors] ??= i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setBusy(true);
    await registerStudent({ ...res.data, whatsappOptIn: optIn });
    navigate({ to: "/done" });
  };

  const Err = ({ k }: { k: keyof Errors }) => (errors[k] ? <p className="mt-1.5 text-sm text-destructive">{errors[k]}</p> : null);

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Reserve your <span className="text-gradient-brand">free seat</span></h1>
      <p className="mt-2 text-muted-foreground">Build Your First AI Project in 60 Minutes.</p>
      {ref && (
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-brand-orange">
          <Gift className="h-3.5 w-3.5" /> Invited by a friend
        </span>
      )}
      <form onSubmit={submit} noValidate className="glass-card mt-6 space-y-4 p-5 sm:p-6">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold">Full name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={field} placeholder="Priya Sharma" />
          <Err k="name" />
        </div>
        <div className="relative">
          <label htmlFor="college" className="mb-1.5 block text-sm font-semibold">College</label>
          <input
            id="college"
            value={collegeQuery}
            onChange={(e) => { setCollegeQuery(e.target.value); setCollege(""); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            className={field}
            placeholder={otherCollege ? "Type your college name" : "Search your college"}
            autoComplete="off"
          />
          {open && !otherCollege && (
            <div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-border bg-popover p-1 shadow-glow">
              {matches.map((c) => (
                <button type="button" key={c} onMouseDown={() => { setCollege(c); setCollegeQuery(c); setOpen(false); }} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-secondary">{c}</button>
              ))}
              <button type="button" onMouseDown={() => { setOtherCollege(true); setCollege(""); setOpen(false); }} className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-brand-orange hover:bg-secondary">Other (type it)</button>
            </div>
          )}
          {otherCollege && <button type="button" onClick={() => { setOtherCollege(false); setCollegeQuery(""); }} className="mt-1 text-xs text-muted-foreground underline">Back to list</button>}
          <Err k="college" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="branch" className="mb-1.5 block text-sm font-semibold">Branch</label>
            <select id="branch" value={branch} onChange={(e) => setBranch(e.target.value)} className={field}>
              <option value="">Select</option>
              {BRANCHES.map((b) => <option key={b}>{b}</option>)}
            </select>
            <Err k="branch" />
          </div>
          <div>
            <label htmlFor="year" className="mb-1.5 block text-sm font-semibold">Year</label>
            <select id="year" value={year} onChange={(e) => setYear(e.target.value)} className={field}>
              {YEARS.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold">WhatsApp number</label>
          <div className="flex gap-2">
            <span className="grid h-12 place-items-center rounded-xl border border-input bg-secondary px-3 text-muted-foreground">+91</span>
            <input id="phone" inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className={field} placeholder="98765 43210" />
          </div>
          <Err k="phone" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} placeholder="you@college.edu" />
          <Err k="email" />
        </div>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} className="h-5 w-5 accent-[var(--brand-purple)]" />
          Send me workshop reminders on WhatsApp
        </label>
        <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-brand py-4 text-lg font-bold text-primary-foreground shadow-glow disabled:opacity-70">
          {busy && <Loader2 className="h-5 w-5 animate-spin" />} Reserve my free seat
        </button>
      </form>
    </div>
  );
}
