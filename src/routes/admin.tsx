import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download } from "lucide-react";

import { getAdminStats, studentsToCsv } from "@/lib/api";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Project Roulette" },
      {
        name: "description",
        content: "Workshop registration stats.",
      },
      {
        property: "og:title",
        content: "Admin — Project Roulette",
      },
      {
        property: "og:description",
        content: "Workshop registration stats.",
      },
      {
        name: "robots",
        content: "noindex",
      },
    ],
  }),

  component: Admin,
});

type Stats = Awaited<ReturnType<typeof getAdminStats>>;

function Admin() {
  const [pin, setPin] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState<Stats | null>(null);

  // Verify the PIN through Supabase.
  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!pin.trim()) {
      setErr("Please enter your admin PIN.");
      return;
    }

    setLoading(true);
    setErr("");

    try {
      // Supabase validates the PIN.
      const result = await getAdminStats(pin);

      if (!result) {
        throw new Error("Invalid admin PIN.");
      }

      // Only unlock the dashboard after verification.
      setStats(result);
      setOk(true);

      // Clear the PIN from the input.
      setPin("");
    } catch (error) {
      console.error("Admin authentication failed:", error);

      setErr("Invalid PIN or unable to load admin statistics.");
      setOk(false);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // Admin login screen.
  if (!ok) {
    return (
      <form
        onSubmit={handleLogin}
        className="glass-card mx-auto mt-10 max-w-xs space-y-3 p-5"
      >
        <h1 className="text-xl font-bold">Admin</h1>

        <input
          type="password"
          inputMode="numeric"
          autoComplete="off"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setErr("");
          }}
          placeholder="Enter PIN"
          className="h-12 w-full rounded-xl border border-input bg-secondary px-3 outline-none"
        />

        {err && (
          <p className="text-sm text-destructive">
            {err}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-brand py-3 font-bold text-primary-foreground disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Enter"}
        </button>
      </form>
    );
  }

  // Display loading state if necessary.
  if (!stats) {
    return (
      <div className="mt-10 text-center">
        Loading admin dashboard...
      </div>
    );
  }

  // Download registration details as CSV.
  const downloadCsv = () => {
    const csvContent = studentsToCsv(stats.students);

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "registrations.csv";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  // Prevent division by zero.
  const refPct =
    stats.total > 0
      ? Math.round(
          (stats.source.referral / stats.total) * 100
        )
      : 0;

  return (
    <div className="space-y-4">

      {/* Dashboard header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">
          Admin
        </h1>

        <button
          onClick={downloadCsv}
          className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold"
        >
          <Download className="h-4 w-4" />
          Download CSV
        </button>
      </div>

      {/* Registration statistics */}
      <div className="grid grid-cols-2 gap-3">

        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">
            Total registrations
          </p>

          <p className="text-3xl font-extrabold text-gradient-brand">
            {stats.total}
          </p>
        </div>

        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">
            Referral vs direct
          </p>

          <p className="text-3xl font-extrabold">
            {refPct}%
          </p>

          <p className="text-xs text-muted-foreground">
            {stats.source.referral} referral ·{" "}
            {stats.source.direct} direct
          </p>
        </div>

      </div>

      {/* Registrations chart */}
      <div className="glass-card p-4">

        <p className="mb-3 font-semibold">
          Registrations per day
        </p>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.perDay}>

              <XAxis
                dataKey="day"
                stroke="var(--muted-foreground)"
                fontSize={11}
              />

              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                width={30}
              />

              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                }}
              />

              <Bar
                dataKey="count"
                fill="var(--brand-purple)"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Colleges and referrers */}
      <div className="grid gap-3 sm:grid-cols-2">

        {/* Top colleges */}
        <div className="glass-card p-4">

          <p className="mb-2 font-semibold">
            Top 5 colleges
          </p>

          {stats.topColleges.map((college, index) => (
            <div
              key={college.college}
              className="flex justify-between py-1 text-sm"
            >
              <span className="truncate">
                {index + 1}. {college.college}
              </span>

              <b>{college.count}</b>
            </div>
          ))}

        </div>

        {/* Top referrers */}
        <div className="glass-card p-4">

          <p className="mb-2 font-semibold">
            Top 5 referrers
          </p>

          {stats.topReferrers.map((referrer, index) => (
            <div
              key={`${referrer.name}-${referrer.college}-${index}`}
              className="flex justify-between py-1 text-sm"
            >
              <span className="truncate">
                {index + 1}. {referrer.name} ·{" "}
                {referrer.college}
              </span>

              <b>{referrer.count}</b>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}