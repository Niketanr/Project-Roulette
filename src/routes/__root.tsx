import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Trophy } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { saveIncomingRef } from "../lib/api";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient-brand">
          404
        </h1>

        <p className="mt-3 text-muted-foreground">
          This page spun off the wheel.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-gradient-brand px-5 py-2.5 font-semibold text-primary-foreground"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);

  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, {
      boundary: "tanstack_root_error_component",
    });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-xl font-semibold">
          This page didn't load
        </h1>

        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-full bg-gradient-brand px-5 py-2.5 font-semibold text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route =
  createRootRouteWithContext<{ queryClient: QueryClient }>()({
    head: () => ({
      meta: [
        {
          charSet: "utf-8",
        },

        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },

        {
          name: "theme-color",
          content: "#14172e",
        },

        {
          title:
            "NxtWave Project Roulette — Your First AI Project in 60 Minutes",
        },

        {
          name: "description",
          content:
            "Spin to get a personalised AI project idea and build it live in NxtWave's free 60-minute workshop.",
        },

        {
          name: "author",
          content: "NxtWave",
        },

        {
          property: "og:title",
          content:
            "NxtWave Project Roulette — Your First AI Project in 60 Minutes",
        },

        {
          property: "og:description",
          content:
            "Spin to get a personalised AI project idea in seconds. Build it live, free.",
        },

        {
          property: "og:type",
          content: "website",
        },

        {
          name: "twitter:card",
          content: "summary_large_image",
        },
      ],

      links: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },

        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },

        {
          rel: "stylesheet",
          href:
            "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap",
        },

        {
          rel: "stylesheet",
          href: appCss,
        },

        {
          rel: "icon",
          href: "/favicon.ico",
          type: "image/x-icon",
        },
      ],
    }),

    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  });

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>

      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  useEffect(() => {
    const ref = new URLSearchParams(
      window.location.search
    ).get("ref");

    if (
      ref &&
      /^[A-Za-z0-9]{3,12}$/.test(ref)
    ) {
      saveIncomingRef(ref);
    }
  }, [pathname]);

  const hideFab = [
    "/register",
    "/done",
    "/admin",
  ].includes(pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-aurora">

        {/* HEADER */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-lg">
          <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">

            <Link
              to="/"
              className="flex items-center gap-2 font-bold"
            >

              {/* NxtWave Logo */}
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-brand shadow-glow">
                <span className="text-sm font-extrabold text-primary-foreground">
                  NW
                </span>
              </span>

              {/* Brand Name */}
              <span>
                NxtWave Project Roulette
              </span>

            </Link>

            <nav className="flex items-center gap-1 text-sm">

              <Link
                to="/leaderboard"
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground"
                activeProps={{
                  className:
                    "text-foreground bg-secondary",
                }}
              >
                <Trophy className="h-4 w-4" />

                Leaderboard
              </Link>

              <Link
                to="/register"
                className="hidden rounded-full bg-gradient-brand px-4 py-1.5 font-semibold text-primary-foreground sm:inline-flex"
              >
                Register
              </Link>

            </nav>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-6 sm:pb-12">
          <Outlet />
        </main>

        {/* FOOTER */}
        <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">

          <p className="font-semibold text-foreground">
            A NxtWave AI workshop
          </p>

          <p className="mt-1">
            Free. Takes 60 minutes. No coding experience needed.
          </p>

          <p className="mt-3 flex justify-center gap-4 text-xs">

            <Link
              to="/me"
              className="hover:text-foreground"
            >
              My dashboard
            </Link>

            <Link
              to="/leaderboard"
              className="hover:text-foreground"
            >
              Leaderboard
            </Link>

          </p>

        </footer>

        {/* MOBILE REGISTER BUTTON */}
        {!hideFab && (
          <Link
            to="/register"
            className="fixed inset-x-4 bottom-4 z-50 rounded-full bg-gradient-brand py-3.5 text-center font-bold text-primary-foreground shadow-glow sm:hidden"
          >
            Register now — it's free
          </Link>
        )}

      </div>

      <Toaster />
    </QueryClientProvider>
  );
}