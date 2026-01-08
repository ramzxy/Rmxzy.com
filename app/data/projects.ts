import { Project } from "../components/project-card";

export const projects: Project[] = [
  {
    id: "cedis",
    index: 1,
    title: "Cedis",
    description:
      "A high-performance Redis clone built from scratch in C++. Implements the RESP protocol, supports persistence, and handles concurrent connections with custom event loop.",
    image: "/projects/cedis.png",
    tech: ["C++", "RESP", "TCP/IP", "Event Loop"],
    github: "https://github.com/ramzxy/Cedis",
  },
  {
    id: "EmuChip8",
    index: 2,
    title: "EmuChip8",
    description:
      "A C++ implementation of the CHIP-8 virtual machine using SDL2, designed to run classic CHIP-8 games and programs.",
    image: "/projects/emuchip8.png",
    tech: ["C++", "SDL2", "CHIP-8", "Emulator"],
    github: "https://github.com/ramzxy/EmuChip8",
  },
  {
    id: "Kazem",
    index: 3,
    title: "Kazem",
    description:
      "Developed a custom VPN client that demonstrates sophisticated network protocol implementation and secure tunneling mechanisms",
    image: "/projects/kazem.png",
    tech: ["C++", "TCP/IP", "Boost.Asio", "TUN/TAP", "SSL", "VPN"],
    github: "https://github.com/ramzxy/kazem",
  },
  {
    id: "ilia.beer",
    index: 4,
    title: "ilia.beer",
    description: "Support my code with a cold one & watch me enjoy it :)",
    image: "/projects/ilia-beer.png",
    tech: ["PHP", "MySQL", "React", "Tailwind CSS"],
    demo: "https://ilia.beer",
    github: "https://github.com/ramzxy/ilia.beer",
  },
];

export const featuredProjects = projects.filter((_, i) => i < 3);
