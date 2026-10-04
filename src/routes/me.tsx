import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy, Lock } from "lucide-react";
import { toast } from "sonner";
import { getStudentByPhone, isValidIndianPhone, normalizePhone, type Student } from "@/lib/api";

export const Route = createFileRoute("/me")({
  head: () => ({
    meta: [
      { title: "My dashboard — Project Roulette" },
      { name: "description", content: "Check your referrals, college rank and unlocked rewards." },
      { property: "og:title", content: "My dashboard — Project Roulette" },
      { property: "og:description", content: "Track referrals and rewards for the free NxtWave AI workshop." },
    ],
  }),
  component: MePage,
});

function MePage() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<{ student: Student; referrals: number; collegeRank: number | null } | null>(null);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = normalizePhone(phone);
    if (!isValidIndianPhone(p)) return setError("Enter a valid 10-digit number");
    const r = await getStudentByPhone(p);
    if (!r) return setError("No registration found for this number.");
    setError("");
    setData(r);
  };

  if (!data)
    return (
      <div>
        <h1 className="text-3xl font-extrabold">My dashboard</h1>
        <p className="mt-2 text-muted-foreground">Enter the WhatsApp number you registered with.</p>
        <form onSubmit={lookup} className="glass-card mt-6 space-y-3 p-5">
          <input inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="98765 43210" className="h-12 w-full rounded-xl border border-input bg-secondary px-3 outline-none focus:ring-2 focus:ring-ring" />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button className="w-full rounded-2xl bg-gradient-brand py-3.5 font-bold text-primary-foreground">Show my stats</button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">Not registered? <Link to="/register" className="underline">Reserve your seat</Link></p>
      </div>
    );

  const { student, referrals, collegeRank } = data;
  const link = `${window.location.origin}/?ref=${student.refCode}`;
  const rewards = [
    { at: 3, label: "Bonus AI Prompt Kit" },
    { at: 10, label: "1:1 Project Review entry" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Hey {student.name.split(" ")[0]} 👋</h1>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="glass-card p-4"><p className="text-xs text-muted-foreground">Referrals</p><p className="mt-1 text-3xl font-extrabold text-gradient-brand">{referrals}</p></div>
        <div className="glass-card p-4"><p className="text-xs text-muted-foreground">College rank</p><p className="mt-1 text-3xl font-extrabold">#{collegeRank ?? "–"}</p><p className="truncate text-xs text-muted-foreground">{student.college}</p></div>
      </div>
      <div className="glass-card mt-3 p-4">
        <p className="text-xs text-muted-foreground">Your referral link</p>
        <div className="mt-2 flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate font-mono text-sm">{link}</p>
          <button onClick={() => { navigator.clipboard.writeText(link); toast.success("Copied!"); }} className="shrink-0 rounded-lg bg-secondary p-2" aria-label="Copy link"><Copy className="h-4 w-4" /></button>
        </div>
      </div>
      <h2 className="mt-6 font-semibold">Rewards</h2>
      <ul className="mt-2 space-y-2">
        {rewards.map((r) => {
          const ok = referrals >= r.at;
          return (
            <li key={r.at} className={`glass-card flex items-center gap-3 p-4 ${ok ? "ring-2 ring-success" : ""}`}>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${ok ? "bg-success text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>{ok ? <Check className="h-4 w-4" /> : <Lock className="h-4 w-4" />}</span>
              <div className="flex-1"><p className="font-semibold">{r.label}</p><p className="text-xs text-muted-foreground">{ok ? "Unlocked!" : `${Math.min(referrals, r.at)} / ${r.at} referrals`}</p></div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
