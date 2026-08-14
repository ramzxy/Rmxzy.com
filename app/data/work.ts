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
    title: "Ramsy",
    role: "Founder / offensive security",
    description:
      "I founded Ramsy, a Dutch cybersecurity firm delivering penetration testing, red teaming, and API security audits.",
    url: "https://ramsy.eu",
    tech: ["Penetration Testing", "API Security", "Red Teaming", "Python"],
  },
  {
    id: "university-of-twente",
    title: "University of Twente",
    role: "Undergraduate security researcher",
    description:
      "I research TLS behaviour in consumer IoT devices alongside my BSc, using network analysis and firmware reverse engineering.",
    url: "https://www.utwente.nl/en/eemcs/scs/",
    tech: ["IoT Security", "TLS", "Network Analysis", "Firmware"],
  },
  {
    id: "quicksports",
    title: "QuickSports B.V.",
    role: "Tech lead / full-stack engineering",
    description:
      "I lead and mentor developers working on the admin platform, from onboarding and code review to task ownership and production delivery.",
    url: "https://thequicksport.com",
    tech: ["Team Leadership", "Product Engineering", "Vue", "Node.js"],
  },
  {
    id: "droneteamtwente",
    title: "Drone Team Twente",
    role: "Chief of Dronobox / engineering",
    description:
      "I lead Dronobox workshops, mentor students building and flying custom drone kits, maintain the fleet, and rebuilt the team’s public site.",
    url: "https://droneteamtwente.nl",
    tech: ["Drone Systems", "Mentoring", "Astro", "TypeScript"],
  },
];
