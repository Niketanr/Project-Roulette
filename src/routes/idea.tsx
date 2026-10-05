import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Lock, RotateCw, Timer, Unlock } from "lucide-react";
import { generateIdea, ALL_IDEA_TITLES, type ProjectIdea, type Comfort } from "@/lib/generateIdea";
import { getForm, getSpins, saveCurrentIdea, setSpins } from "@/lib/api";

export const Route = createFileRoute("/idea")({
  head: () => ({
    meta: [
      { title: "Your AI project idea — Project Roulette" },
      { name: "description", content: "Your personalised AI project idea, buildable in 60 minutes." },
      { property: "og:title", content: "I just spun my first AI project idea" },
      { property: "og:description", content: "Spin yours and build it live in a free 60-minute workshop." },
    ],
  }),
  component: IdeaPage,
});

const MAX_SPINS = 3;

function IdeaPage() {
  const navigate = useNavigate();
  const [idea, setIdea] = useState<ProjectIdea | null>(null);
  const [spinning, setSpinning] = useState(true);
  const [reel, setReel] = useState(ALL_IDEA_TITLES[0]);
  const [spins, setSpinCount] = useState(0);
  const seen = useRef<string[]>([]);

  const run = async () => {
    const form = getForm();
    if (!form) {
      navigate({ to: "/ideas" });
      return;
    }
    const n = getSpins() + 1;
    setSpins(n);
    setSpinCount(n);
    setSpinning(true);
    const iv = setInterval(() => setReel(ALL_IDEA_TITLES[Math.floor(Math.random() * ALL_IDEA_TITLES.length)]), 90);
    const [result] = await Promise.all([
      generateIdea({ branch: form["branch"] ?? "", interest: form["interest"] ?? "Other", comfort: (form["comfort"] ?? "Beginner") as Comfort }, seen.current),
      new Promise((r) => setTimeout(r, 2000)),
    ]);
    clearInterval(iv);
    seen.current.push(result.title);
    saveCurrentIdea(result);
    setIdea(result);
    setSpinning(false);
  };

  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pt-2">
      <AnimatePresence mode="wait">
        {spinning ? (
          <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card flex min-h-[340px] flex-col items-center justify-center p-6 text-center shadow-glow">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="h-16 w-16 rounded-full border-4 border-secondary border-t-brand-orange border-r-brand-purple" />
            <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">Spinning…</p>
            <div className="mt-3 h-16 overflow-hidden">
              <motion.p key={reel} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-lg font-bold">{reel}</motion.p>
            </div>
          </motion.div>
        ) : idea ? (
          <motion.div key="result" initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", damping: 18 }}>
            <p className="text-center text-sm text-muted-foreground">Your first AI project</p>
            <div className="mt-3 rounded-3xl bg-gradient-brand p-[1.5px] shadow-glow">
              <div className="rounded-3xl bg-card p-5 sm:p-6">
                <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">{idea.title}</h1>
                <p className="mt-2 text-muted-foreground">{idea.pitch}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-primary/20 px-3 py-1 text-foreground">{idea.difficulty}</span>
                  <span className="flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-brand-orange"><Timer className="h-3.5 w-3.5" /> Buildable in 60 min</span>
                </div>
                <div className="mt-5">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Tools</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {idea.tools.map((t) => <span key={t} className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm">{t}</span>)}
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Roadmap</p>
                  <ol className="mt-3 space-y-2">
                    {idea.steps.slice(0, 2).map((s, i) => (
                      <li key={s} className="flex gap-3 rounded-xl bg-secondary p-3">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-primary-foreground">{i + 1}</span>
                        <span className="text-sm">{s}</span>
                      </li>
                    ))}
                    <li className="relative overflow-hidden rounded-xl">
                      <div className="space-y-2 blur-sm select-none" aria-hidden>
                        {idea.steps.slice(2).map((s, i) => (
                          <div key={s} className="flex gap-3 rounded-xl bg-secondary p-3">
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-muted text-sm">{i + 3}</span>
                            <span className="text-sm">{s}</span>
                          </div>
                        ))}
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 px-4 text-center">
                        <Lock className="h-6 w-6 text-brand-orange" />
                        <p className="mt-2 text-sm font-semibold">Unlock full blueprint by registering for the free workshop</p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <Link to="/register" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-brand py-4 font-bold text-primary-foreground shadow-glow">
                <Unlock className="h-5 w-5" /> Unlock full blueprint + reserve my seat
              </Link>
              <button onClick={run} disabled={spins >= MAX_SPINS} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-secondary py-3.5 font-semibold disabled:opacity-50">
                <RotateCw className="h-4 w-4" /> {spins >= MAX_SPINS ? "No spins left" : `Spin again (${MAX_SPINS - spins} left)`}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
