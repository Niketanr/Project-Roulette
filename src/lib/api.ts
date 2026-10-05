// Data layer backed by Supabase. Same exports as the old localStorage version.
import { createClient } from "@supabase/supabase-js";
import type { ProjectIdea } from "./generateIdea";

export const BRANCHES = ["CSE", "IT", "ECE", "EEE", "Mech", "Civil", "AI/ML", "Other"];
export const INTERESTS = ["Cricket", "Music", "Health", "Finance", "Gaming", "Movies", "Farming", "Travel", "Fashion", "Other"];
export const YEARS = ["1st year", "2nd year", "3rd year", "Final year", "Graduated"];

export const COLLEGES = [
  "IIT Madras", "IIT Bombay", "IIT Hyderabad", "NIT Warangal", "NIT Trichy", "BITS Pilani", "VIT Vellore",
  "SRM Chennai", "Anna University", "JNTU Hyderabad", "Osmania University", "CBIT Hyderabad", "VNR VJIET",
  "Vasavi College of Engineering", "GRIET Hyderabad", "KL University", "Andhra University", "GITAM Visakhapatnam",
  "Amrita Coimbatore", "PSG Tech Coimbatore", "RV College Bengaluru", "BMS College Bengaluru", "PES University",
  "MIT Manipal", "COEP Pune", "VJTI Mumbai", "DTU Delhi", "NSUT Delhi", "Jadavpur University", "Thapar University",
];

export interface Student {
  id: string;
  name: string;
  college: string;
  branch: string;
  year: string;
  phone: string;
  email: string;
  whatsappOptIn: boolean;
  refCode: string;
  referredBy: string | null;
  ideaTitle: string | null;
  createdAt: string;
}

const supabase = createClient(
  import.meta.env["VITE_SUPABASE_URL"] as string,
  import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string,
);

// ---------- Browser-only session helpers (current user's own state) ----------
const ME_KEY = "pr_me_student";
const REF_KEY = "pr_ref";
const IDEA_KEY = "pr_idea";
const SPINS_KEY = "pr_spins";
const FORM_KEY = "pr_form";

const isBrowser = () => typeof window !== "undefined";
const read = <T,>(k: string, fallback: T): T => {
  if (!isBrowser()) return fallback;
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (k: string, v: unknown) => isBrowser() && localStorage.setItem(k, JSON.stringify(v));

export const normalizePhone = (p: string) => p.replace(/\D/g, "").slice(-10);
export const isValidIndianPhone = (p: string) => /^[6-9]\d{9}$/.test(p);

export const saveIncomingRef = (code: string) => write(REF_KEY, code.toUpperCase().slice(0, 12));
export const getIncomingRef = (): string | null => read<string | null>(REF_KEY, null);
export const saveCurrentIdea = (idea: ProjectIdea) => write(IDEA_KEY, idea);
export const getCurrentIdea = (): ProjectIdea | null => read<ProjectIdea | null>(IDEA_KEY, null);
export const getSpins = () => read<number>(SPINS_KEY, 0);
export const setSpins = (n: number) => write(SPINS_KEY, n);
export const saveForm = (f: Record<string, string>) => write(FORM_KEY, f);
export const getForm = () => read<Record<string, string> | null>(FORM_KEY, null);
export const getMe = (): Student | null => read<Student | null>(ME_KEY, null);

// ---------- Mapping ----------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromRow = (r: any): Student => ({
  id: r.id,
  name: r.name,
  college: r.college,
  branch: r.branch,
  year: r.year,
  phone: r.phone,
  email: r.email,
  whatsappOptIn: r.whatsapp_opt_in,
  refCode: r.ref_code,
  referredBy: r.referred_by,
  ideaTitle: r.idea_title,
  createdAt: r.created_at,
});

// ---------- Public API ----------
export type RegisterInput = Omit<Student, "id" | "refCode" | "createdAt" | "referredBy" | "ideaTitle">;

export async function registerStudent(input: RegisterInput): Promise<Student> {
  const { data, error } = await supabase.rpc("register_student", {
    p_name: input.name,
    p_college: input.college,
    p_branch: input.branch,
    p_year: input.year,
    p_phone: normalizePhone(input.phone),
    p_email: input.email,
    p_opt_in: input.whatsappOptIn,
    p_ref: getIncomingRef(),
    p_idea: getCurrentIdea()?.title ?? null,
  });
  if (error) throw new Error(error.message);
  const student = fromRow(data);
  write(ME_KEY, student);
  return student;
}

export async function getStudentByPhone(phone: string) {
  const { data, error } = await supabase.rpc("get_student_stats", { p_phone: normalizePhone(phone) });
  if (error) throw new Error(error.message);
  if (!data) return null;
  return { student: fromRow(data.student), referrals: data.referrals as number, collegeRank: (data.college_rank as number) ?? null };
}

export async function getReferralCount(code: string) {
  const { data, error } = await supabase.rpc("get_referral_count", { p_code: code });
  if (error) throw new Error(error.message);
  return (data as number) ?? 0;
}

export interface CollegeRow { college: string; count: number }
export interface ReferrerRow { name: string; college: string; count: number }

// The `live` argument is kept so existing pages don't break; data is always real now.
export async function getLeaderboard(_live = true): Promise<{ colleges: CollegeRow[]; referrers: ReferrerRow[] }> {
  const { data, error } = await supabase.rpc("get_leaderboard");
  if (error) throw new Error(error.message);
  return { colleges: data.colleges ?? [], referrers: data.referrers ?? [] };
}

export async function getTotalRegistrations() {
  const { data, error } = await supabase.rpc("get_total_registrations");
  if (error) throw new Error(error.message);
  return (data as number) ?? 0;
}

// Throws if the PIN is wrong. The PIN is checked inside Supabase, not in the browser.
export async function getAdminStats(pin: string) {
  const { data, error } = await supabase.rpc("admin_stats", { p_pin: pin });
  if (error) throw new Error(error.message);
  const board = await getLeaderboard(false);
  const total = data.total as number;
  const referral = data.referral_count as number;
  return {
    total,
    perDay: data.per_day as { day: string; count: number }[],
    topColleges: board.colleges.slice(0, 5),
    topReferrers: board.referrers.slice(0, 5),
    source: { referral, direct: total - referral },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    students: (data.students as any[]).map(fromRow),
  };
}

export function studentsToCsv(students: Student[]) {
  const cols: (keyof Student)[] = ["name", "college", "branch", "year", "phone", "email", "whatsappOptIn", "refCode", "referredBy", "ideaTitle", "createdAt"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(","), ...students.map((s) => cols.map((c) => esc(s[c])).join(","))].join("\n");
}

/* -------------------------------------------------------------------------- */
/* AI Project Evaluator                                                       */
/* -------------------------------------------------------------------------- */

const PENDING_EVAL_KEY = "project_roulette_pending_eval";

export type EvaluationSummary = {
  id: string;
  repo_name: string;
  overall: number;
  headline: string;
};

export type EvaluationReport = {
  unlocked: boolean;
  id: string;
  repo_name: string;
  overall: number;
  headline?: string;
  report?: {
    project_summary: string;
    headline: string;
    scores: {
      code_structure: number;
      documentation: number;
      testing: number;
      real_world_relevance: number;
      complexity: number;
      deployment_readiness: number;
    };
    strengths: string[];
    improvements: {
      area: string;
      fix: string;
    }[];
    signals: {
      files: number;
      readme_chars: number;
      has_tests: boolean;
      has_ci: boolean;
      has_docker: boolean;
      has_license: boolean;
      has_dependency_file: boolean;
      has_env_example: boolean;
      commits: number;
      last_push: string | null;
      size_kb: number;
      stars: number;
      is_fork: boolean;
      languages: string[];
    };
  };
};

export async function evaluateProject(
  repoUrl: string,
): Promise<EvaluationSummary> {
  const url = import.meta.env["VITE_SUPABASE_URL"] as string;
  const key = import.meta.env[
    "VITE_SUPABASE_PUBLISHABLE_KEY"
  ] as string;

  const res = await fetch(
    `${url}/functions/v1/evaluate-project`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ repoUrl }),
    },
  );

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.id) {
    throw new Error(
      typeof data?.error === "string"
        ? data.error
        : "The evaluation failed. Please try again.",
    );
  }

  const result: EvaluationSummary = {
    id: String(data.id),
    repo_name: String(data.repo_name ?? ""),
    overall: Number(data.overall ?? 0),
    headline: String(data.headline ?? ""),
  };

  setPendingEval(result.id);

  return result;
}

export function setPendingEval(id: string) {
  localStorage.setItem(PENDING_EVAL_KEY, id);
}

export function getPendingEval(): string | null {
  return localStorage.getItem(PENDING_EVAL_KEY);
}

export function clearPendingEval() {
  localStorage.removeItem(PENDING_EVAL_KEY);
}

export async function linkEvaluation(evalId: string) {
  const me = getMe();

  if (!me?.phone) {
    throw new Error(
      "Please register before unlocking your evaluation.",
    );
  }

  const url = import.meta.env["VITE_SUPABASE_URL"] as string;
  const key = import.meta.env[
    "VITE_SUPABASE_PUBLISHABLE_KEY"
  ] as string;

  const res = await fetch(
    `${url}/rest/v1/rpc/link_evaluation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        p_eval_id: evalId,
        p_phone: me.phone,
      }),
    },
  );

  const data = await res.json().catch(() => null);

  if (!res.ok || data !== true) {
    throw new Error(
      "We couldn't link your evaluation to your registration.",
    );
  }

  return true;
}

export async function getEvaluation(
  id: string,
  phone?: string,
): Promise<EvaluationReport> {
  const url = import.meta.env["VITE_SUPABASE_URL"] as string;
  const key = import.meta.env[
    "VITE_SUPABASE_PUBLISHABLE_KEY"
  ] as string;

  const res = await fetch(
    `${url}/rest/v1/rpc/get_evaluation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        p_id: id,
        p_phone: phone ?? null,
      }),
    },
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      typeof data?.message === "string"
        ? data.message
        : "Unable to load the evaluation.",
    );
  }

  return data as EvaluationReport;
}