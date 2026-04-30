import { Project } from "../components/project-card";

export const projects: Project[] = [
  {
    id: "khor",
    index: 1,
    title: "Khor",
    description:
      "A real-time kernel orchestra for Linux. eBPF probes capture live system activity (exec, scheduler, network, block I/O, IRQs) and a deterministic music engine maps it into generative sound through a custom synth, MIDI, and OSC.",
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
      "A high-performance Redis clone built from scratch in C++. Implements the RESP protocol, supports persistence, and handles concurrent connections with a custom event loop.",
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
      "A C++ implementation of the CHIP-8 virtual machine using SDL2, designed to run classic CHIP-8 games and programs.",
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
