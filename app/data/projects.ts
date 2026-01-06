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
    id: "distributed-kv",
    index: 2,
    title: "Distributed KV Store",
    description:
      "Fault-tolerant distributed key-value store implementing Raft consensus. Features automatic leader election, log replication, and partition tolerance.",
    image: "/projects/distributed-kv.png",
    tech: ["Go", "Raft", "gRPC", "Distributed Systems"],
    github: "https://github.com/ramzxy/distributed-kv",
  },
  {
    id: "quicksports",
    index: 3,
    title: "QuickSports",
    description:
      "Full-stack sports management platform with real-time game scheduling, team management, and community features. 10k+ active users.",
    image: "/projects/quicksports.png",
    tech: ["Vue.js", "Node.js", "MongoDB", "WebSocket"],
    demo: "https://quicksports.app",
  },
  {
    id: "neural-net",
    index: 4,
    title: "Neural Network from Scratch",
    description:
      "Educational implementation of a neural network library in Python. No frameworks, just NumPy. Supports various activation functions, optimizers, and layer types.",
    image: "/projects/neural-net.png",
    tech: ["Python", "NumPy", "ML", "Backpropagation"],
    github: "https://github.com/ramzxy/neural-scratch",
  },
];

export const featuredProjects = projects.filter((_, i) => i < 3);
