import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import {
  getEvaluation,
  getMe,
  type EvaluationReport,
} from "@/lib/api";

export const Route = createFileRoute("/report/$id")({
  component: ReportPage,
});

function ReportPage() {
  const { id } = Route.useParams();

  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const me = getMe();

        const result = await getEvaluation(
          id,
          me?.phone,
        );

        setReport(result);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load the evaluation.",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />

          <p className="mt-4 font-semibold">
            Loading your AI evaluation...
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Preparing your project report.
          </p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <div className="rounded-3xl border border-border bg-card p-8">
          <div className="text-4xl">😕</div>

          <h1 className="mt-4 text-2xl font-bold">
            Evaluation unavailable
          </h1>

          <p className="mt-2 text-muted-foreground">
            {error || "We couldn't find this evaluation."}
          </p>

          <Link
            to="/evaluate"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 font-semibold text-primary-foreground shadow-glow"
          >
            Try another project
          </Link>
        </div>
      </div>
    );
  }

  const unlocked = report.unlocked;
  const data = report.report;

  if (!unlocked || !data) {
    return (
      <div className="mx-auto max-w-2xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <section className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-brand shadow-glow">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-primary">
            Your evaluation is ready
          </p>

          <h1 className="mt-2 text-3xl font-extrabold">
            {report.repo_name}
          </h1>

          <div className="mx-auto mt-6 grid h-28 w-28 place-items-center rounded-full border-8 border-primary/20">
            <div>
              <p className="text-3xl font-extrabold">
                {report.overall}
              </p>

              <p className="text-xs text-muted-foreground">
                / 100
              </p>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-lg text-lg leading-7 text-muted-foreground">
            {report.headline ||
              "Your AI project evaluation is ready."}
          </p>

          <div className="mt-8 rounded-2xl bg-secondary p-5 text-left">
            <p className="font-semibold">
              Unlock your complete report
            </p>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Register for the free workshop to see your detailed
              scores, strengths, and specific improvements.
            </p>
          </div>

          <Link
            to="/register"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand px-6 py-4 font-bold text-primary-foreground shadow-glow"
          >
            Unlock my full report
            <Sparkles className="h-5 w-5" />
          </Link>
        </section>
      </div>
    );
  }

  const scores = [
    ["Code structure", data.scores.code_structure],
    ["Documentation", data.scores.documentation],
    ["Testing", data.scores.testing],
    ["Real-world relevance", data.scores.real_world_relevance],
    ["Complexity", data.scores.complexity],
    ["Deployment readiness", data.scores.deployment_readiness],
  ] as const;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      {/* Header */}
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="bg-gradient-brand p-6 text-primary-foreground sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold opacity-80">
                AI Project Evaluation
              </p>

              <h1 className="mt-2 break-all text-2xl font-extrabold sm:text-3xl">
                {report.repo_name}
              </h1>

              <p className="mt-3 max-w-2xl leading-6 opacity-90">
                {data.headline}
              </p>
            </div>

            <div className="shrink-0 text-center">
              <div className="grid h-28 w-28 place-items-center rounded-full border-4 border-white/30 bg-white/10">
                <div>
                  <p className="text-4xl font-extrabold">
                    {report.overall}
                  </p>

                  <p className="text-xs opacity-80">
                    out of 100
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Project summary
          </p>

          <p className="mt-2 leading-7 text-muted-foreground">
            {data.project_summary}
          </p>
        </div>
      </section>

      {/* Scores */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Target className="h-6 w-6 text-primary" />

          <h2 className="text-xl font-bold">
            Score breakdown
          </h2>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {scores.map(([label, score]) => (
            <div key={label}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {label}
                </span>

                <span className="font-bold text-primary">
                  {score}/100
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-brand transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strengths */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-primary" />

          <h2 className="text-xl font-bold">
            What's working well
          </h2>
        </div>

        <div className="mt-5 space-y-3">
          {data.strengths.map((strength, index) => (
            <div
              key={index}
              className="flex gap-3 rounded-2xl bg-secondary p-4"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <p className="leading-6">
                {strength}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Improvements */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-primary" />

          <h2 className="text-xl font-bold">
            What to improve next
          </h2>
        </div>

        <div className="mt-5 space-y-4">
          {data.improvements.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border p-5"
            >
              <p className="text-sm font-bold text-primary">
                {item.area}
              </p>

              <p className="mt-2 leading-6 text-muted-foreground">
                {item.fix}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Evidence */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <h2 className="text-xl font-bold">
          Repository signals
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Signal
            label="Files"
            value={String(data.signals.files)}
          />

          <Signal
            label="Commits"
            value={String(data.signals.commits)}
          />

          <Signal
            label="Tests"
            value={data.signals.has_tests ? "Yes" : "No"}
          />

          <Signal
            label="CI"
            value={data.signals.has_ci ? "Yes" : "No"}
          />

          <Signal
            label="Docker"
            value={data.signals.has_docker ? "Yes" : "No"}
          />

          <Signal
            label="License"
            value={data.signals.has_license ? "Yes" : "No"}
          />

          <Signal
            label="Dependencies"
            value={
              data.signals.has_dependency_file
                ? "Yes"
                : "No"
            }
          />

          <Signal
            label="Env example"
            value={
              data.signals.has_env_example
                ? "Yes"
                : "No"
            }
          />
        </div>

        {data.signals.languages.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-semibold">
              Languages detected
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {data.signals.languages.map((language) => (
                <span
                  key={language}
                  className="rounded-full bg-secondary px-3 py-1 text-sm"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="rounded-3xl border border-border bg-card p-6 text-center sm:p-8">
        <h2 className="text-2xl font-bold">
          Ready to make your project stronger?
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Use the recommendations above to improve your project
          and make it more impressive for recruiters.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/ideas"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-6 py-3 font-semibold text-primary-foreground shadow-glow"
          >
            Get another project idea
          </Link>

          <a
            href={`https://github.com/${report.repo_name}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 font-semibold hover:bg-secondary"
          >
            View GitHub
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}

function Signal({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-secondary p-4">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-bold">
        {value}
      </p>
    </div>
  );
}