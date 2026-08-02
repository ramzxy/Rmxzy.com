import type { Project } from "../components/project-card";

export const projects: Project[] = [
  {
    id: "khor",
    index: 1,
    title: "Khor",
    description:
      "Turns live Linux kernel activity into sound. eBPF captures the system; a C++ engine maps it to synth, MIDI, and OSC.",
    image: "/projects/khor.webp",
    tech: ["C++", "eBPF", "Linux", "MIDI", "OSC"],
    github: "https://github.com/ramzxy/khor",
    featured: true,
  },
  {
    id: "cedis",
    index: 2,
    title: "Cedis",
    description:
      "A Redis-compatible server in C++ with RESP, persistence, concurrent clients, and a custom event loop.",
    image: "/projects/cedis.webp",
    tech: ["C++", "RESP", "TCP/IP", "Event Loop"],
    github: "https://github.com/ramzxy/Cedis",
    featured: true,
  },
  {
    id: "emuchip8",
    index: 3,
    title: "EmuChip8",
    description:
      "A CHIP-8 emulator in C++ and SDL2, built to understand a virtual machine from instruction fetch to display.",
    image: "/projects/emuchip8.webp",
    tech: ["C++", "SDL2", "CHIP-8", "Emulator"],
    github: "https://github.com/ramzxy/EmuChip8",
    featured: true,
  },
  {
    id: "hamistegan",
    index: 4,
    title: "Hamistegan",
    tagline: "live syscall sandbox",
    description:
      "Custom Linux sandbox with eBPF interception for live syscall analysis.",
    tech: ["C++", "eBPF", "Linux"],
    github: "https://github.com/ramzxy/Hamistegan",
  },
  {
    id: "kazem",
    index: 5,
    title: "Kazem",
    tagline: "VPN client in C++",
    description:
      "VPN client written from scratch in C++. TUN/TAP tunneling over SSL with Boost.Asio.",
    tech: ["C++", "TUN/TAP", "SSL", "Boost.Asio"],
    github: "https://github.com/ramzxy/Kazem-VPN-client",
  },
  {
    id: "quarto",
    index: 6,
    title: "Quarto",
    tagline: "award-winning game AI",
    description:
      "Award-winning Quarto game AI with alpha-beta pruning over the full game tree.",
    tech: ["C++", "Game AI", "Alpha-Beta"],
    github: "https://github.com/ramzxy/quarto",
  },
  {
    id: "ilia.beer",
    index: 7,
    title: "ilia.beer",
    tagline: "buy me a beer",
    description:
      "Buy me a beer, watch a clip of me drinking it. PHP backend on a Raspberry Pi.",
    tech: ["PHP", "MySQL", "React", "Raspberry Pi"],
    demo: "https://ilia.beer",
    github: "https://github.com/ramzxy/ilia.beer",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
