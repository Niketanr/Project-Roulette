import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { getLeaderboard, getMe, type CollegeRow, type ReferrerRow } from "@/lib/api";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — Project Roulette" },
      { name: "description", content: "Which college is building the most AI projects? See live college and referrer rankings." },
      { property: "og:title", content: "Is your college winning? — Project Roulette Leaderboard" },
      { property: "og:description", content: "Top college gets featured by NxtWave. Top referrer gets a free 1:1 project review." },
    ],
  }),
  component: Leaderboard,
});

const medal = ["bg-gold text-accent-foreground", "bg-silver text-accent-foreground", "bg-bronze text-accent-foreground"];

function Leaderboard() {
  const [tab, setTab] = useState<"colleges" | "referrers">("colleges");
  const [colleges, setColleges] = useState<CollegeRow[]>([]);
  const [referrers, setReferrers] = useState<ReferrerRow[]>([]);
  const [myCollege, setMyCollege] = useState<string | null>(null);

  useEffect(() => {
    setMyCollege(getMe()?.college ?? null);
    const load = (live: boolean) => getLeaderboard(live).then((d) => { setColleges(d.colleges); setReferrers(d.referrers); });
    load(false);
    const iv = setInterval(() => load(true), 15000);
    return () => clearInterval(iv);
  }, []);

  const max = colleges[0]?.count ?? 1;

  return (
    <div>
      <div className="rounded-2xl bg-gradient-brand p-4 text-primary-foreground shadow-glow">
        <div className="flex items-start gap-3">
          <Trophy className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold">Top college gets featured by NxtWave. Top referrer gets a free 1:1 project review.</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 rounded-full bg-secondary p-1">
        {(["colleges", "referrers"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full py-2.5 text-sm font-semibold transition ${tab === t ? "bg-card text-foreground shadow-glow" : "text-muted-foreground"}`}>
            {t === "colleges" ? "Colleges" : "Top referrers"}
          </button>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">Live · updates every 15s</p>

      <ul className="mt-3 space-y-2">
        {tab === "colleges"
          ? colleges.map((c, i) => (
              <motion.li layout key={c.college} transition={{ type: "spring", damping: 25 }} className={`glass-card flex items-center gap-3 p-3 ${c.college === myCollege ? "ring-2 ring-brand-orange" : ""}`}>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${medal[i] ?? "bg-secondary"}`}>{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <p className="truncate font-semibold">{c.college}{c.college === myCollege && <span className="ml-2 text-xs text-brand-orange">You</span>}</p>
                    <p className="shrink-0 font-bold">{c.count}</p>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <motion.div animate={{ width: `${(c.count / max) * 100}%` }} className="h-full bg-gradient-brand" />
                  </div>
                </div>
              </motion.li>
            ))
          : referrers.map((r, i) => (
              <motion.li layout key={r.name + r.college} transition={{ type: "spring", damping: 25 }} className="glass-card flex items-center gap-3 p-3">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${medal[i] ?? "bg-secondary"}`}>{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{r.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{r.college}</p>
                </div>
                <p className="shrink-0 font-bold">{r.count} <span className="text-xs font-normal text-muted-foreground">refs</span></p>
              </motion.li>
            ))}
      </ul>
    </div>
  );
}
