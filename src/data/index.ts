import { NavItem, Experience, Education, Project, Skill, Publication } from "@/types";

export const personalInfo = {
  name:         "MD. SHANJID AREFIN",
  role:         "Software Engineer (R&D)",
  company:      "Shanghai BDCOM (Bangladesh)",
  email:        "shihabkuetcse@gmail.com",
  github:       "https://github.com/ShihabKuet",
  linkedin:     "https://linkedin.com/in/shihabkuet",
  researchgate: "https://www.researchgate.net/profile/Md-Shanjid-Arefin",
  medium:       "https://medium.com/@shihabkuetcse",
  blog:         "https://sanzidarefin.wordpress.com",
  location:     "Dhaka, Bangladesh",
  bio: `Software Engineer (R&D) at Shanghai BDCOM with a passion for building 
  scalable systems and exploring emerging technologies. 
  Graduated from KUET in 2024 with a degree in Computer Science & Engineering. 
  I love turning complex problems into elegant solutions.`,
  shortBio:     "Building scalable systems & exploring emerging tech.",
  availableForWork: false,
};

export const navItems: NavItem[] = [
  { label: "About",        href: "/#about",        icon: "User"          },
  { label: "Skills",       href: "/#skills",       icon: "Wrench"        },
  { label: "Experience",   href: "/#experience",   icon: "Briefcase"     },
  { label: "Expertise",    href: "/#expertise",    icon: "Network"       },
  { label: "Research",     href: "/#publications", icon: "FlaskConical"  },
  { label: "Projects",     href: "/#projects",     icon: "FolderOpen"    },
  { label: "Education",    href: "/#education",    icon: "GraduationCap" },
  { label: "Coding",       href: "/#coding",       icon: "Terminal"      },
  { label: "Achievements", href: "/#achievements", icon: "Trophy"        },
  { label: "Blog",         href: "/blog",          icon: "PenLine"       },
  { label: "Contact",      href: "/#contact",      icon: "Mail"          },
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

export const publications: Publication[] = [
  {
    title: "An Assistive Device for the Visually Impaired for Enhanced Navigation and Reading",
    authors: ["Md. Shanjid Arefin", "Sadman Sakib", "Muhammad Sheikh Sadi"],
    journal: "2024 13th International Conference on Electrical and Computer Engineering (ICECE)",
    year: "2024",
    doi: "10.1109/ICECE64886.2024.11024586",
    link: "https://ieeexplore.ieee.org/document/11024586",
    abstract: "Visual impairments have emerged as a prevalent issue over recent decades. The daily lives of visually impaired individuals are full of challenges, leading to a significant dependence on others for assistance with everyday tasks. Though various systems have been developed to aid the visually impaired in their day-to-day life, many of these are constrained by their specific domains. In this paper, we have taken a comprehensive approach to develop a solution aimed at enhancing the mobility and reading capabilities of the visually impaired. The solution is provided by developing an embedded spectacle glass with realtime obstacle avoidance, fall detection, and textual information extraction modules. The system generates an audible alert upon detecting obstacles ahead. In the event of an accident, the fall detection module sends an emergency response to a designated caregiver. The optical character recognition (OCR) module includes various image preprocessing techniques, an OCR engine, and a text-to-speech converter. In the optical character recognition module, the overall character error rate (CER) and word error rate (WER) are 6.97% and 9.46% respectively. The paper provides a comprehensive solution for the visually impaired by developing a portable, wearable, lightweight, and low-cost spectacle by which they can get assistance to detect obstacles around them and get textual information easily.",
    tags: ["Error analysis", "Optical character recognition", "Visual impairment", "Text to speech" , "Sensors", "Image preprocessing" , "Fall detection", "Collision avoidance"],
  }
];

export const codingProfiles = {
  leetcode:   "ShihabKuet",   // ← replace
  hackerrank: "ShihabKuetCSE", // ← replace
  codeforces: "ShihabKuet",   // ← replace or remove
};

// For platforms without a public API, enter your stats manually here.
// Update these whenever you solve more problems.
export const manualCodingStats = {
  hackerrank: {
    solved:     120,
    stars:      "5 Star",
    badges:     8,
    certificate: "Problem Solving (Intermediate)",
  },
  codeforces: {
    solved:  200,
    rating:  1200,
    rank:   "Pupil",
  },
};

export const achievements = [
  {
    title: "Fundamentals of Engineering (FE) Exam",
    issuer: "IEEE / NCEES",
    date: "October 2024",
    description: "Passed the FE Computer Engineering exam — a nationally recognized engineering certification. Physical certificate pending collection.",
    credentialUrl: "",           // ← add URL if available
    image: "/certs/fe-exam.jpg", // ← add certificate image if you have it
    category: "certification",
    highlight: true,             // marks it as a featured achievement
  },
  {
    title: "Problem Solving (Intermediate)",
    issuer: "HackerRank",
    date: "2024",
    description: "Certified in intermediate-level problem solving covering data structures and algorithms.",
    credentialUrl: "https://www.hackerrank.com/certificates/your-cert-id", // ← replace
    image: "",
    category: "certification",
    highlight: false,
  },
  {
    title: "Your Other HackerRank Certificate",
    issuer: "HackerRank",
    date: "2024",
    description: "Brief description of what this certificate covers.",
    credentialUrl: "https://www.hackerrank.com/certificates/your-cert-id",
    image: "",
    category: "certification",
    highlight: false,
  },
];