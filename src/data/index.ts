import { NavItem, Experience, Education, Project, Skill } from "@/types";

export const personalInfo = {
  name: "MD. SHANJID AREFIN",              // ← Replace with your name
  role: "Software Engineer (R&D)",
  company: "Shanghai BDCOM (Bangladesh)",
  email: "shihabkuetcse@gmail.com",        // ← Replace
  github: "https://github.com/ShihabKuet",  // ← Replace
  linkedin: "https://linkedin.com/in/shihabkuet", // ← Replace
  location: "Dhaka, Bangladesh",
  bio: `Software Engineer (R&D) at Shanghai BDCOM with a passion for building 
  scalable systems and exploring emerging technologies. 
  Graduated from KUET in 2024 with a degree in Computer Science & Engineering. 
  I love turning complex problems into elegant solutions.`,
  shortBio: "Building scalable systems & exploring emerging tech.",
  availableForWork: false,
};

export const navItems: NavItem[] = [
  { label: "About",      href: "#about" },
  { label: "Skills",     href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects",   href: "#projects" },
  { label: "Education",  href: "#education" },
  { label: "Blog",       href: "#blog" },
  { label: "Contact",    href: "#contact" },
];

export const experiences: Experience[] = [
  {
    company: "Shanghai BDCOM (Bangladesh)",
    role: "Software Engineer (R&D)",
    duration: "2024 – Present",
    location: "Bangladesh",
    description: [
      "Describe your key responsibility here",
      "Another impactful contribution",
      "Mention any research or product you worked on",
    ],
    technologies: ["C", "Python", "Linux", "Networking"], // ← Update these
  },
];

export const education: Education[] = [
  {
    institution: "Khulna University of Engineering & Technology (KUET)",
    degree: "B.Sc. (Engg.) in Computer Science & Engineering",
    duration: "2019 – 2024",
    result: "CGPA: 3.42 / 4.00", // ← Fill in
    description: "Relevant coursework: Data Structures, Algorithms, Computer Networks, Computer Graphics, OS...",
  },
  {
    institution: "Govt. M. M. City College, Khulna",
    degree: "Science (HSC)",
    duration: "2017 – 2018",
    result: "CGPA: 5.00 / 5.00", // ← Fill in
    description: "Completed Higher Secondary Certificate with a focus on science subjects.",
  },
];

export const skills: Skill[] = [
  { name: "Python",     level: 85, category: "languages" },
  { name: "C/C++",      level: 80, category: "languages" },
  { name: "JavaScript", level: 75, category: "languages" },
  { name: "TypeScript", level: 70, category: "languages" },
  { name: "React",      level: 75, category: "frontend" },
  { name: "Next.js",    level: 65, category: "frontend" },
  { name: "Tailwind",   level: 70, category: "frontend" },
  { name: "Node.js",    level: 65, category: "backend" },
  { name: "Linux",      level: 80, category: "tools" },
  { name: "Git",        level: 80, category: "tools" },
];

export const projects: Project[] = [
  // --- FEATURED PROJECTS (shown as large cards) ---
  {
    title: "Your Best Project Title",
    description:
      "A detailed description of what this project does, the problem it solves, and your role in building it. Make it 2-3 sentences — this is what recruiters read.",
    technologies: ["Python", "React", "Node.js", "PostgreSQL"],
    github: "https://github.com/ShihabKuet/project-one",
    live: "",
    featured: true,
    category: "fullstack",
  },
  {
    title: "Second Featured Project",
    description:
      "Describe this project here. What was the technical challenge? What did you learn? Mention any measurable outcomes like performance improvements or users.",
    technologies: ["C", "Linux", "Networking", "Python"],
    github: "https://github.com/ShihabKuet/project-two",
    live: "",
    featured: true,
    category: "systems",
  },

  // --- OTHER PROJECTS (shown as compact cards) ---
  {
    title: "Side Project or Tool",
    description: "A short description of this project.",
    technologies: ["Python", "CLI"],
    github: "https://github.com/ShihabKuet/project-three",
    featured: false,
    category: "tools",
  },
  {
    title: "Another Project",
    description: "A short description of this project.",
    technologies: ["JavaScript", "HTML", "CSS"],
    github: "https://github.com/ShihabKuet/project-four",
    featured: false,
    category: "frontend",
  },
  {
    title: "Research or Uni Project",
    description: "A short description of what this was about.",
    technologies: ["Python", "Machine Learning"],
    github: "",
    featured: false,
    category: "ml",
  },
  {
    title: "Another Tool or Script",
    description: "A short description of this utility or automation.",
    technologies: ["Bash", "Linux"],
    github: "",
    featured: false,
    category: "tools",
  },
];