import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand shadow-glow">
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            NxtWave Project Roulette
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Build smarter.{" "}
            <span className="bg-gradient-brand bg-clip-text text-transparent">
              Get AI feedback.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Spin up a project idea in 60 minutes, or submit your GitHub project
            and get an AI-powered evaluation with practical improvement tips.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/ideas"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-6 py-3 font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02]"
            >
              Get a project idea
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/evaluate"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 font-semibold transition hover:bg-muted"
            >
              Evaluate my project
            </Link>
          </div>
        </div>
      </section>

      {/* Two paths */}
      <section className="grid gap-5 md:grid-cols-2">
        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-3xl border border-border bg-card p-6"
        >
          <div className="mb-4 text-3xl">🎯</div>

          <h2 className="text-xl font-bold">Need a project idea?</h2>

          <p className="mt-2 leading-6 text-muted-foreground">
            Tell us your branch, interests, and coding comfort level. Spin the
            wheel and get a project you can start building immediately.
          </p>

          <Link
            to="/ideas"
            className="mt-5 inline-flex items-center gap-2 font-semibold text-primary"
          >
            Spin Project Roulette
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-3xl border border-border bg-card p-6"
        >
          <div className="mb-4 text-3xl">🔍</div>

          <h2 className="text-xl font-bold">Already built a project?</h2>

          <p className="mt-2 leading-6 text-muted-foreground">
            Paste your public GitHub repository. Our AI reviewer checks
            structure, documentation, testing, relevance, complexity, and
            deployment readiness.
          </p>

          <Link
            to="/evaluate"
            className="mt-5 inline-flex items-center gap-2 font-semibold text-primary"
          >
            Evaluate my GitHub project
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center">How it works</h2>

        <div className="mt-7 grid gap-6 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary/10 font-bold text-primary">
              1
            </div>
            <h3 className="mt-3 font-semibold">Choose your path</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get a new idea or evaluate something you already built.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary/10 font-bold text-primary">
              2
            </div>
            <h3 className="mt-3 font-semibold">Let AI analyse</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get feedback based on your project's actual GitHub evidence.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary/10 font-bold text-primary">
              3
            </div>
            <h3 className="mt-3 font-semibold">Improve your project</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              See your score, strengths, and specific next steps.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}