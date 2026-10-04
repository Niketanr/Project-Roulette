import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { Dices, FileText, Rocket } from "lucide-react";
import { BRANCHES, INTERESTS, getTotalRegistrations, saveForm, setSpins } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Project Roulette — Spin your first AI project idea" },
      { name: "description", content: "Get a personalised AI project idea in 10 seconds and build it live in a free 60-minute NxtWave workshop." },
      { property: "og:title", content: "What's the first AI project YOU could build in 60 minutes?" },
      { property: "og:description", content: "Spin the roulette. Get a personalised AI project idea in 10 seconds. Free." },
    ],
  }),
  component: Home,
});

const COMFORT = ["Beginner", "Some Python", "Comfortable"] as const;

function Home() {
  const navigate = useNavigate();
  const [branch, setBranch] = useState("");
  const [interest, setInterest] = useState("");
  const [comfort, setComfort] = useState<string>("");
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    getTotalRegistrations().then((total) => {
      const c = animate(0, total, { duration: 2, ease: "easeOut", onUpdate: (v) => setCount(Math.round(v)) });
      return () => c.stop();
    });
  }, []);

  const spin = () => {
    if (!branch || !interest || !comfort) {
      setError("Pick all three so we can personalise your idea.");
      return;
    }
    saveForm({ branch, interest, comfort });
    setSpins(0);
    navigate({ to: "/idea" });
  };

  return (
    <div>
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="pt-4 text-center">
        <span className="inline-flex rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          Free workshop · Build Your First AI Project in 60 Minutes
        </span>
        <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-5xl">
          What's the first AI project <span className="text-gradient-brand">YOU</span> could build in 60 minutes?
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Spin the roulette. Get a personalised AI project idea in 10 seconds. Free.
        </p>
      </motion.section>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="glass-card mt-8 space-y-5 p-5 shadow-glow sm:p-6">
        <div>
          <label htmlFor="branch" className="mb-2 block text-sm font-semibold">Your branch</label>
          <select id="branch" value={branch} onChange={(e) => setBranch(e.target.value)} className="h-12 w-full rounded-xl border border-input bg-secondary px-3 text-foreground outline-none focus:ring-2 focus:ring-ring">
            <option value="">Select branch</option>
            {BRANCHES.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">What are you into?</p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <button key={i} type="button" onClick={() => setInterest(i)} className={`rounded-full border px-3.5 py-2 text-sm transition ${interest === i ? "border-transparent bg-gradient-brand font-semibold text-primary-foreground" : "border-border bg-secondary text-muted-foreground hover:text-foreground"}`}>
                {i}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Coding comfort</p>
          <div className="grid grid-cols-3 gap-2">
            {COMFORT.map((c) => (
              <button key={c} type="button" onClick={() => setComfort(c)} className={`rounded-xl border px-2 py-3 text-sm transition ${comfort === c ? "border-primary bg-primary/20 font-semibold text-foreground" : "border-border bg-secondary text-muted-foreground"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <motion.button whileTap={{ scale: 0.97 }} onClick={spin} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-brand py-4 text-lg font-bold text-primary-foreground shadow-glow">
          <Dices className="h-5 w-5" /> Spin my project idea
        </motion.button>
      </motion.div>

      <section className="mt-12">
        <p className="text-center text-sm text-muted-foreground">
          <span className="text-2xl font-extrabold text-foreground">{count.toLocaleString("en-IN")}</span> students joined
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Dices, t: "Spin", d: "Tell us your branch & vibe. Get a matched idea." },
            { icon: FileText, t: "Get your blueprint", d: "Tools, steps and a 5-step roadmap." },
            { icon: Rocket, t: "Build it live", d: "Ship it in the 60-min workshop with mentors." },
          ].map((s, i) => (
            <motion.div key={s.t} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand"><s.icon className="h-5 w-5 text-primary-foreground" /></span>
                <div>
                  <p className="font-semibold">{i + 1}. {s.t}</p>
                  <p className="text-sm text-muted-foreground">{s.d}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
