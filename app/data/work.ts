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
    role: "founder & engineer",
    description:
      "AI-augmented offensive security firm. Pen testing engagements paired with custom tooling that automates recon, fuzz triage, and reporting.",
    url: "https://ramsy.eu",
    tech: ["Security", "AI Tooling", "Next.js", "Python"],
  },
  {
    id: "droneteamtwente",
    title: "droneteamtwente.nl",
    role: "web engineer",
    description:
      "Public site for the University of Twente's autonomous-drone student team. Annual IMechE UAS challenge competitors building disaster-relief UAVs.",
    url: "https://droneteamtwente.nl",
    tech: ["Web", "TypeScript", "Static Site"],
  },
];
