export type Work = {
  id: string;
  title: string;
  role: string;
  description: string;
  url: string;
  tech: string[];
};

export const work: Work[] = [
  {
    id: "ramsy",
    title: "ramsy.eu",
    role: "Founder / engineering",
    description:
      "I founded ramsy.eu to pair hands-on security work with tooling we actually use for recon, fuzzing triage, evidence, and reporting.",
    url: "https://ramsy.eu",
    tech: ["Security", "AI Tooling", "Next.js", "Python"],
  },
  {
    id: "droneteamtwente",
    title: "Drone Team Twente",
    role: "Website / engineering",
    description:
      "I rebuilt the public site for the University of Twente team developing autonomous aircraft for disaster-response challenges.",
    url: "https://droneteamtwente.nl",
    tech: ["Web", "TypeScript", "Static Site"],
  },
];
