import { NavItem, Experience, Education, Project, Skill } from "@/types";

export const personalInfo = {
  name: "Your Name",              // ← Replace with your name
  role: "Software R&D Engineer",
  company: "Shanghai BDCOM (Bangladesh)",
  email: "your@email.com",        // ← Replace
  github: "https://github.com/yourusername",  // ← Replace
  linkedin: "https://linkedin.com/in/yourusername", // ← Replace
  location: "Bangladesh",
  bio: `Software R&D Engineer at Shanghai BDCOM with a passion for building 
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
    role: "Software R&D Engineer",
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
    degree: "B.Sc. in Computer Science & Engineering",
    duration: "2019 – 2024",
    result: "CGPA: X.XX / 4.00", // ← Fill in
    description: "Relevant coursework: Data Structures, Algorithms, Computer Networks, OS...",
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
  {
    title: "Project Name",
    description: "A brief description of what this project does and the problem it solves.",
    technologies: ["Python", "React", "Node.js"],
    github: "https://github.com/yourusername/project",
    featured: true,
  },
];