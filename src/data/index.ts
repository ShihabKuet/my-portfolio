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
    title: "An Assistive Device for the Visually Impaired for Enhanced Navigation and Reading",
    description:
      "An academic thesis and project on Smart Eye-wear device. A thesis of smartware device which has modules of i. Fall Detection, ii. Object Distance Detection iii. Image to Text Conversion and feeding the output to the bluetooth speaker.",
    technologies: ["Python", "Raspberry Pi Nano", "Embedded System", "Hardware"],
    github: "https://github.com/ShihabKuet/project-one",
    live: "",
    featured: true,
    category: "thesis",
    image: "thesis_paper.png",
  },
  {
    title: "3D Dynamic Airport - OpenGL",
    description:
      "Project on Computer Graphics featuring controllable dynamic aeroplanes, lighiting and texturing etc.",
    technologies: ["C", "C++", "OpenGL 3.3", "GLAD", "CMake"],
    github: "https://github.com/ShihabKuet/3D_Airport_OpenGL_GLAD",
    live: "",
    featured: true,
    category: "computer-graphics",
    image: "opengl.jpg",
  },

  // --- OTHER PROJECTS (shown as compact cards) ---
  {
    title: "LAN-Based Developer Forum (BDCOM Devs Forum)",
    description: "A full-stack web platform designed for internal team collaboration within a LAN environment. Built with Flask and SQLAlchemy, the system allows users to post technical problems, share solutions, and interact via comments, likes, and notifications. Implemented IP-based identity mapping, username validation flows, and a scalable notification system supporting future features like post following and tag subscriptions.",
    technologies: ["Python", "Flask", "SQLite/PostgreSQL", "JavaScript"],
    github: "https://github.com/ShihabKuet/BDCOM_DEVs",
    featured: false,
    category: "fullstack",
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