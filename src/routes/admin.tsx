import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download } from "lucide-react";
import { ADMIN_PIN, getAdminStats, studentsToCsv } from "@/lib/api";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Project Roulette" },
      { name: "description", content: "Workshop registration stats." },
      { property: "og:title", content: "Admin — Project Roulette" },
      { property: "og:description", content: "Workshop registration stats." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Stats = Awaited<ReturnType<typeof getAdminStats>>;

function Admin() {
  const [pin, setPin] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (ok) getAdminStats().then(setStats);
  }, [ok]);

  if (!ok)
    return (
      <form onSubmit={(e) => { e.preventDefault(); pin === ADMIN_PIN ? setOk(true) : setErr("Wrong PIN"); }} className="glass-card mx-auto mt-10 max-w-xs space-y-3 p-5">
        <h1 className="text-xl font-bold">Admin</h1>
        <input type="password" inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Enter PIN" className="h-12 w-full rounded-xl border border-input bg-secondary px-3 outline-none" />
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button className="w-full rounded-2xl bg-gradient-brand py-3 font-bold text-primary-foreground">Enter</button>
      </form>
    );
  if (!stats) return null;

  const csv = () => {
    const blob = new Blob([studentsToCsv(stats.students)], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "registrations.csv";
    a.click();
  };
  const refPct = Math.round((stats.source.referral / stats.total) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Admin</h1>
        <button onClick={csv} className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold"><Download className="h-4 w-4" /> Download CSV</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4"><p className="text-xs text-muted-foreground">Total registrations</p><p className="text-3xl font-extrabold text-gradient-brand">{stats.total}</p></div>
        <div className="glass-card p-4"><p className="text-xs text-muted-foreground">Referral vs direct</p><p className="text-3xl font-extrabold">{refPct}%</p><p className="text-xs text-muted-foreground">{stats.source.referral} referral · {stats.source.direct} direct</p></div>
      </div>
      <div className="glass-card p-4">
        <p className="mb-3 font-semibold">Registrations per day</p>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={stats.perDay}>
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} width={30} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Bar dataKey="count" fill="var(--brand-purple)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="glass-card p-4">
          <p className="mb-2 font-semibold">Top 5 colleges</p>
          {stats.topColleges.map((c, i) => <div key={c.college} className="flex justify-between py-1 text-sm"><span className="truncate">{i + 1}. {c.college}</span><b>{c.count}</b></div>)}
        </div>
        <div className="glass-card p-4">
          <p className="mb-2 font-semibold">Top 5 referrers</p>
          {stats.topReferrers.map((r, i) => <div key={r.name + r.college} className="flex justify-between py-1 text-sm"><span className="truncate">{i + 1}. {r.name} · {r.college}</span><b>{r.count}</b></div>)}
        </div>
      </div>
    </div>
  );
}
