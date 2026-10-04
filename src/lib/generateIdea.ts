// Project Roulette - AI Project Idea Generator

export type Comfort = "Beginner" | "Some Python" | "Comfortable";

export interface IdeaInput {
  branch: string;
  interest: string;
  comfort: Comfort;
}

export interface ProjectIdea {
  title: string;
  pitch: string;
  difficulty: "Easy" | "Medium" | "Spicy";
  tools: string[];
  steps: string[]; // 5 steps
  interest: string;
}

const IDEAS: ProjectIdea[] = [
  {
    interest: "Cricket",
    title: "Cricket Shot Classifier using your webcam",
    pitch: "Show a cover drive to your camera and the AI names the shot.",
    difficulty: "Easy",
    tools: ["Python", "Teachable Machine", "Streamlit"],
    steps: [
      "Record 30 clips of 4 shots",
      "Train an image model in Teachable Machine",
      "Export the model and load it in Python",
      "Build a live webcam app in Streamlit",
      "Deploy and share with your team",
    ],
  },
  {
    interest: "Cricket",
    title: "IPL Match Winner Predictor",
    pitch: "Predict who wins tonight using 15 seasons of IPL data.",
    difficulty: "Medium",
    tools: ["Python", "Pandas", "Scikit-learn"],
    steps: [
      "Download the IPL dataset",
      "Clean and pick key features",
      "Train a classifier",
      "Test on last season",
      "Make a simple prediction UI",
    ],
  },
  {
    interest: "Music",
    title: "Mood-to-Playlist Generator",
    pitch: "Type how you feel, get a playlist that matches your vibe.",
    difficulty: "Easy",
    tools: ["Python", "Gemini API", "Streamlit"],
    steps: [
      "Set up a free AI API key",
      "Write a mood-to-genre prompt",
      "Map genres to song lists",
      "Build the chat UI",
      "Add a share button",
    ],
  },
  {
    interest: "Music",
    title: "Hum-to-Raga Detector",
    pitch: "Hum a tune and the AI guesses the closest raga.",
    difficulty: "Spicy",
    tools: ["Python", "Librosa", "Teachable Machine"],
    steps: [
      "Record hum samples",
      "Extract pitch features",
      "Train an audio model",
      "Build mic input",
      "Show confidence scores",
    ],
  },
  {
    interest: "Health",
    title: "Desk Posture Coach",
    pitch: "Your webcam nudges you when you slouch during study hours.",
    difficulty: "Easy",
    tools: ["Python", "MediaPipe", "OpenCV"],
    steps: [
      "Install MediaPipe pose",
      "Track shoulder & neck points",
      "Set a slouch threshold",
      "Trigger alerts",
      "Log daily posture score",
    ],
  },
  {
    interest: "Health",
    title: "Food Photo Calorie Guesser",
    pitch: "Snap your thali, get an instant calorie estimate.",
    difficulty: "Medium",
    tools: ["Python", "Gemini Vision", "Streamlit"],
    steps: [
      "Get a vision AI key",
      "Prompt for dish detection",
      "Map dishes to calories",
      "Build photo upload UI",
      "Add a weekly tracker",
    ],
  },
  {
    interest: "Finance",
    title: "Expense Roast Bot",
    pitch: "Paste your UPI history and the AI roasts your spending.",
    difficulty: "Easy",
    tools: ["Python", "Gemini API", "Streamlit"],
    steps: [
      "Export UPI statement as CSV",
      "Categorise with AI",
      "Write a roast prompt",
      "Build the UI",
      "Add saving tips",
    ],
  },
  {
    interest: "Finance",
    title: "Stock Sentiment Radar",
    pitch: "Read today's news headlines and score the market mood.",
    difficulty: "Medium",
    tools: ["Python", "Hugging Face", "Pandas"],
    steps: [
      "Scrape headlines",
      "Load a sentiment model",
      "Score each headline",
      "Plot the trend",
      "Ship a dashboard",
    ],
  },
  {
    interest: "Gaming",
    title: "Hand-Gesture Game Controller",
    pitch: "Play Subway Surfers with hand waves instead of a keyboard.",
    difficulty: "Medium",
    tools: ["Python", "MediaPipe", "PyAutoGUI"],
    steps: [
      "Detect hand landmarks",
      "Define 4 gestures",
      "Map gestures to keys",
      "Tune the speed",
      "Record a demo reel",
    ],
  },
  {
    interest: "Gaming",
    title: "AI Dungeon Master",
    pitch: "A text adventure that writes itself as you play.",
    difficulty: "Easy",
    tools: ["Python", "Gemini API", "Streamlit"],
    steps: [
      "Design the story prompt",
      "Keep chat memory",
      "Add choices as buttons",
      "Add inventory",
      "Share your story",
    ],
  },
  {
    interest: "Movies",
    title: "Movie Recommender from your vibe",
    pitch: "Describe a mood, get 5 movies you'll actually like.",
    difficulty: "Easy",
    tools: ["Python", "Gemini API", "Streamlit"],
    steps: [
      "Load a movies dataset",
      "Embed movie plots",
      "Match mood to plots",
      "Build the UI",
      "Add posters",
    ],
  },
  {
    interest: "Movies",
    title: "Dialogue-to-Movie Guesser",
    pitch: "Type a famous dialogue and the AI names the film.",
    difficulty: "Medium",
    tools: ["Python", "Hugging Face", "Gradio"],
    steps: [
      "Collect dialogue dataset",
      "Create embeddings",
      "Search by similarity",
      "Build Gradio app",
      "Add a quiz mode",
    ],
  },
  {
    interest: "Farming",
    title: "Leaf Disease Detector",
    pitch: "Snap a crop leaf, get the disease name and a fix.",
    difficulty: "Easy",
    tools: ["Python", "Teachable Machine", "Streamlit"],
    steps: [
      "Download PlantVillage images",
      "Train a leaf model",
      "Load it in Python",
      "Add photo upload",
      "Show treatment tips",
    ],
  },
  {
    interest: "Farming",
    title: "Kisan Weather Advisor",
    pitch: "A chatbot that tells farmers when to sow, in their language.",
    difficulty: "Medium",
    tools: ["Python", "Weather API", "Gemini API"],
    steps: [
      "Get weather API key",
      "Fetch local forecast",
      "Prompt for crop advice",
      "Add Hindi/Telugu replies",
      "Deploy on WhatsApp-style UI",
    ],
  },
  {
    interest: "Travel",
    title: "AI Trip Planner on a Student Budget",
    pitch: "Give a city and ₹5000, get a full weekend plan.",
    difficulty: "Easy",
    tools: ["Python", "Gemini API", "Streamlit"],
    steps: [
      "Write a planner prompt",
      "Add budget constraints",
      "Format as day-wise plan",
      "Build the UI",
      "Export as PDF",
    ],
  },
  {
    interest: "Travel",
    title: "Landmark Recogniser",
    pitch: "Point your camera at a monument, hear its story.",
    difficulty: "Medium",
    tools: ["Python", "Gemini Vision", "gTTS"],
    steps: [
      "Set up vision AI",
      "Identify the landmark",
      "Generate a short story",
      "Convert to speech",
      "Build the app",
    ],
  },
  {
    interest: "Fashion",
    title: "Outfit Rater",
    pitch: "Upload your fit, get a score and styling tips.",
    difficulty: "Easy",
    tools: ["Python", "Gemini Vision", "Streamlit"],
    steps: [
      "Set up vision AI",
      "Write a stylist prompt",
      "Score the outfit",
      "Build upload UI",
      "Add a share card",
    ],
  },
  {
    interest: "Fashion",
    title: "Colour Palette Matcher",
    pitch: "Find which colours suit your skin tone from one selfie.",
    difficulty: "Medium",
    tools: ["Python", "OpenCV", "Scikit-learn"],
    steps: [
      "Detect face region",
      "Extract skin tone",
      "Cluster colours",
      "Suggest palettes",
      "Build the UI",
    ],
  },
  {
    interest: "Other",
    title: "Lecture Notes Summariser",
    pitch: "Drop a 1-hour lecture PDF, get a 1-page cheat sheet.",
    difficulty: "Easy",
    tools: ["Python", "Gemini API", "Streamlit"],
    steps: [
      "Extract PDF text",
      "Chunk the content",
      "Prompt for summaries",
      "Build the UI",
      "Add flashcards",
    ],
  },
  {
    interest: "Other",
    title: "Campus Doubt-Solver Bot",
    pitch: "A chatbot trained on your syllabus that answers doubts 24/7.",
    difficulty: "Medium",
    tools: ["Python", "LangChain", "Streamlit"],
    steps: [
      "Collect syllabus PDFs",
      "Create embeddings",
      "Build retrieval",
      "Add chat UI",
      "Share with classmates",
    ],
  },
];

/**
 * Local fallback generator.
 *
 * This is used if the Gemini/Supabase Edge Function is unavailable.
 * Keeping this fallback means the application can still generate
 * an idea even if the AI service has a temporary problem.
 */
function localIdea(
  input: IdeaInput,
  exclude: string[] = [],
): Promise<ProjectIdea> {
  return new Promise((resolve) => {
    let pool = IDEAS.filter((i) => i.interest === input.interest);

    if (pool.length === 0) {
      pool = IDEAS.filter((i) => i.interest === "Other");
    }

    let fresh = pool.filter((i) => !exclude.includes(i.title));

    if (fresh.length === 0) {
      fresh = IDEAS.filter((i) => !exclude.includes(i.title));
    }

    if (fresh.length === 0) {
      fresh = IDEAS;
    }

    if (input.comfort === "Beginner") {
      const easy = fresh.filter((i) => i.difficulty === "Easy");

      if (easy.length) {
        fresh = easy;
      }
    }

    const idea = fresh[Math.floor(Math.random() * fresh.length)]!;

    setTimeout(() => resolve(idea), 300);
  });
}

/**
 * Generates a project idea using the Supabase Edge Function.
 *
 * Flow:
 *
 * Browser
 *   ↓
 * Supabase Edge Function
 *   ↓
 * Gemini API
 *   ↓
 * AI-generated project idea
 *
 * If anything fails, localIdea() is used as a fallback.
 */
export async function generateIdea(
  input: IdeaInput,
  exclude: string[] = [],
): Promise<ProjectIdea> {
  const url = import.meta.env["VITE_SUPABASE_URL"] as string;

  // IMPORTANT:
  // This matches the variable used in your .env and api.ts.
  const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string;

  // Validate environment configuration before making the request.
  if (!url || !key) {
    console.warn(
      "Supabase environment variables are missing. Using local idea generator.",
    );

    return localIdea(input, exclude);
  }

  const ctrl = new AbortController();

  // Prevent the UI from waiting forever if the Edge Function hangs.
  const timer = setTimeout(() => ctrl.abort(), 12000);

  try {
    const res = await fetch(`${url}/functions/v1/generate-idea`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        // Supabase publishable key.
        apikey: key,

        // Supabase Edge Functions accept the Supabase key
        // through the Authorization header as well.
        Authorization: `Bearer ${key}`,
      },

      body: JSON.stringify({
        ...input,
        exclude,
      }),

      signal: ctrl.signal,
    });

    if (!res.ok) {
      throw new Error(`generate-idea returned status ${res.status}`);
    }

    const idea = await res.json();

    // Validate the response before giving it to the UI.
    if (
      !idea?.title ||
      !idea?.pitch ||
      !idea?.difficulty ||
      !Array.isArray(idea.steps) ||
      idea.steps.length < 5 ||
      !Array.isArray(idea.tools)
    ) {
      throw new Error("Invalid idea response shape");
    }

    return idea as ProjectIdea;
  } catch (error) {
    console.warn(
      "AI idea generation failed. Using local fallback.",
      error,
    );

    return localIdea(input, exclude);
  } finally {
    clearTimeout(timer);
  }
}

// Keep this line because the rest of the application may use it.
export const ALL_IDEA_TITLES = IDEAS.map((i) => i.title);