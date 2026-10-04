import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { toPng } from "html-to-image";
import { QRCodeSVG } from "qrcode.react";
import {
  Copy,
  Download,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import {
  getMe,
  getReferralCount,
  getCurrentIdea,
  type Student,
} from "@/lib/api";

import type { ProjectIdea } from "@/lib/generateIdea";

export const Route = createFileRoute("/done")({
  head: () => ({
    meta: [
      {
        title: "You're in! — NxtWave Project Roulette",
      },
      {
        name: "description",
        content:
          "Your seat is reserved. View your personalized AI project blueprint and invite friends.",
      },
      {
        property: "og:title",
        content:
          "I'm building my first AI project in 60 minutes",
      },
      {
        property: "og:description",
        content:
          "Spin your own idea and join the free NxtWave workshop.",
      },
    ],
  }),

  component: DonePage,
});

function DonePage() {
  const navigate = useNavigate();

  const [me, setMe] = useState<Student | null>(null);
  const [idea, setIdea] = useState<ProjectIdea | null>(null);
  const [refs, setRefs] = useState(0);
  const [link, setLink] = useState("");

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = getMe();

    if (!s) {
      navigate({ to: "/register" });
      return;
    }

    setMe(s);

    // Get the complete AI-generated project idea
    setIdea(getCurrentIdea());

    setLink(
      `${window.location.origin}/?ref=${s.refCode}`
    );

    getReferralCount(s.refCode).then(setRefs);

    // Celebration confetti
    const end = Date.now() + 1200;

    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ["#a855f7", "#f97316", "#ec4899"],
      });

      confetti({
        particleCount: 6,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ["#a855f7", "#f97316", "#ec4899"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [navigate]);

  if (!me) return null;

  const title =
    me.ideaTitle ??
    idea?.title ??
    "My first AI project";

  const first = me.name.split(" ")[0];

  const shareText =
    `I just reserved my seat to build "${title}" ` +
    `in 60 minutes at NxtWave's free AI workshop! ` +
    `Spin your own AI project idea: ${link}`;

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    toast.success("Link copied!");
  };

  const download = async () => {
    if (!cardRef.current) return;

    const url = await toPng(cardRef.current, {
      pixelRatio: 2,
    });

    const a = document.createElement("a");

    a.href = url;
    a.download = `nxtwave-project-${first}.png`;

    a.click();
  };

  return (
    <div className="text-center">

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      <motion.h1
        initial={{
          scale: 0.8,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        className="text-3xl font-extrabold"
      >
        You're in{" "}
        <span className="text-gradient-brand">
          {first}
        </span>
        ! 🎉
      </motion.h1>

      <p className="mt-2 text-muted-foreground">
        Workshop details will reach you on WhatsApp.
      </p>


      {/* =====================================================
          PROJECT SHARE CARD
      ===================================================== */}

      <motion.div
        initial={{
          y: 20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          delay: 0.2,
        }}
        className="mx-auto mt-6 max-w-sm"
      >
        <div
          ref={cardRef}
          className="rounded-3xl bg-gradient-brand p-[2px]"
        >
          <div className="rounded-3xl bg-card p-6 text-left">

            {/* BRAND */}

            <div className="flex items-center gap-2 text-sm font-bold">

              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-brand">
                <span className="text-[10px] font-extrabold text-primary-foreground">
                  NW
                </span>
              </span>

              <span>
                NxtWave Project Roulette
              </span>

            </div>


            {/* PROJECT LABEL */}

            <p className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">
              My first AI project
            </p>


            {/* PROJECT TITLE */}

            <p className="mt-1 text-2xl font-extrabold leading-tight">
              {title}
            </p>


            <p className="mt-3 text-sm font-semibold text-gradient-brand">
              Build yours free.
            </p>


            {/* STUDENT + QR */}

            <div className="mt-6 flex items-end justify-between gap-4">

              <div className="min-w-0">

                <p className="font-semibold">
                  {first}
                </p>

                <p className="truncate text-sm text-muted-foreground">
                  {me.college}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  A NxtWave workshop
                </p>

              </div>


              {/* QR CODE */}

              <div className="shrink-0 rounded-xl bg-foreground p-1.5">

                <QRCodeSVG
                  value={link}
                  size={68}
                  bgColor="transparent"
                  fgColor="currentColor"
                  className="text-background"
                />

              </div>

            </div>

          </div>
        </div>
      </motion.div>


      {/* =====================================================
          PERSONALIZED PROJECT BLUEPRINT
      ===================================================== */}

      {idea && (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.35,
          }}
          className="mx-auto mt-6 max-w-sm rounded-3xl border border-border bg-card p-5 text-left shadow-lg sm:p-6"
        >

          {/* BLUEPRINT HEADER */}

          <div className="flex items-center gap-2">

            <span className="text-2xl">
              🚀
            </span>

            <h2 className="text-xl font-extrabold">
              Your Project Blueprint
            </h2>

          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Here's your personalized AI project plan. You'll build it live
            during the NxtWave workshop.
          </p>


          {/* =================================================
              WHAT YOU WILL BUILD
          ================================================= */}

          <div className="mt-5 rounded-2xl bg-secondary p-4">

            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              What you'll build
            </p>

            <h3 className="mt-1 text-lg font-bold">
              {idea.title}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {idea.pitch}
            </p>

          </div>


          {/* =================================================
              DIFFICULTY
          ================================================= */}

          <div className="mt-5">

            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Difficulty
            </p>

            <span className="mt-2 inline-flex rounded-full bg-primary/20 px-3 py-1.5 text-sm font-semibold">
              {idea.difficulty}
            </span>

          </div>


          {/* =================================================
              TOOLS
          ================================================= */}

          <div className="mt-5">

            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Tools you'll use
            </p>

            <div className="mt-2 flex flex-wrap gap-2">

              {idea.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm font-medium"
                >
                  {tool}
                </span>
              ))}

            </div>

          </div>


          {/* =================================================
              FULL 5-STEP ROADMAP
          ================================================= */}

          <div className="mt-6">

            <div className="flex items-center justify-between">

              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Your 5-step roadmap
              </p>

              <span className="text-xs font-semibold text-brand-purple">
                Unlocked ✓
              </span>

            </div>


            <ol className="mt-3 space-y-3">

              {idea.steps.map((step, index) => (
                <li
                  key={`${index}-${step}`}
                  className="flex gap-3 rounded-2xl bg-secondary p-3"
                >

                  {/* NUMBER */}

                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </span>


                  {/* STEP CONTENT */}

                  <div className="flex-1">

                    <p className="text-xs font-semibold text-muted-foreground">
                      STEP {index + 1}
                    </p>

                    <p className="mt-0.5 text-sm font-medium leading-relaxed">
                      {step}
                    </p>

                  </div>

                </li>
              ))}

            </ol>

          </div>


          {/* =================================================
              WORKSHOP MESSAGE
          ================================================= */}

          <div className="mt-5 rounded-2xl border border-border bg-background/40 p-4 text-center">

            <p className="text-sm font-semibold">
              🎯 Ready to build it?
            </p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Join the free NxtWave workshop and build your project live.
            </p>

          </div>

        </motion.div>
      )}


      {/* =====================================================
          WHATSAPP + SHARE
      ===================================================== */}

      <div className="mx-auto mt-6 max-w-sm space-y-3">

        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            shareText
          )}`}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-success py-4 font-bold text-accent-foreground"
        >

          <MessageCircle className="h-5 w-5" />

          Share on WhatsApp

        </a>


        <div className="grid grid-cols-2 gap-3">

          <button
            onClick={copy}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-secondary py-3 font-semibold"
          >

            <Copy className="h-4 w-4" />

            Copy my link

          </button>


          <button
            onClick={download}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-secondary py-3 font-semibold"
          >

            <Download className="h-4 w-4" />

            Download card

          </button>

        </div>


        {/* REFERRAL LINK */}

        <p className="break-all rounded-xl bg-secondary px-3 py-2 font-mono text-xs text-muted-foreground">
          {link}
        </p>

      </div>


      {/* =====================================================
          REFERRAL BONUS
      ===================================================== */}

      <div className="glass-card mx-auto mt-6 max-w-sm p-5 text-left">

        <p className="font-semibold">
          Refer 3 friends to unlock the Bonus AI Prompt Kit
        </p>


        <div className="mt-3 h-3 overflow-hidden rounded-full bg-secondary">

          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${(Math.min(refs, 3) / 3) * 100}%`,
            }}
            className="h-full bg-gradient-brand"
          />

        </div>


        <p className="mt-2 text-sm text-muted-foreground">
          {Math.min(refs, 3)} / 3 friends joined
        </p>

      </div>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <div className="mt-6 flex justify-center gap-4 text-sm">

        <Link
          to="/leaderboard"
          className="text-muted-foreground underline hover:text-foreground"
        >
          See leaderboard
        </Link>

        <Link
          to="/me"
          className="text-muted-foreground underline hover:text-foreground"
        >
          My dashboard
        </Link>

      </div>

    </div>
  );
}