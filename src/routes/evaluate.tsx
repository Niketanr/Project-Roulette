import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Github, Loader2, Sparkles } from "lucide-react";
import { evaluateProject } from "@/lib/api";

export const Route = createFileRoute("/evaluate")({
  component: EvaluatePage,
});

function EvaluatePage() {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEvaluate = async () => {
    setError("");

    const value = repoUrl.trim();

    if (!value) {
      setError("Please paste your GitHub repository link.");
      return;
    }

    if (!/^https:\/\/(www\.)?github\.com\/[^/]+\/[^/]+\/?$/.test(value)) {
      setError(
        "Please enter a valid public GitHub repository link, like https://github.com/username/project"
      );
      return;
    }

    try {
      setLoading(true);

      const result = await evaluateProject(value);

      navigate({
        to: "/report/$id",
        params: { id: result.id },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The evaluation failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand shadow-glow">
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-primary">
            AI Project Evaluator
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            How strong is your project?
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">
            Paste your public GitHub repository and get an AI-powered review
            covering code structure, documentation, testing, relevance,
            complexity, and deployment readiness.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-xl">
          <label
            htmlFor="repo"
            className="mb-2 block text-sm font-semibold"
          >
            GitHub repository URL
          </label>

          <div className="relative">
            <Github className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <input
              id="repo"
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleEvaluate();
                }
              }}
              placeholder="https://github.com/username/project"
              disabled={loading}
              className="w-full rounded-xl border border-border bg-background py-3.5 pl-12 pr-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            />
          </div>

          {error && (
            <p className="mt-3 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleEvaluate}
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand px-6 py-3.5 font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Evaluating your project...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Evaluate my project
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Only public GitHub repositories are supported.
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 text-center">
          <p className="text-2xl">📁</p>
          <p className="mt-2 font-semibold">Code structure</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Organisation and separation
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 text-center">
          <p className="text-2xl">🧪</p>
          <p className="mt-2 font-semibold">Testing</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tests and engineering quality
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 text-center">
          <p className="text-2xl">🚀</p>
          <p className="mt-2 font-semibold">Deployment</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Production readiness
          </p>
        </div>
      </section>
    </div>
  );
}