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
  bio: `I work close to the metal — debugging systems where a single null pointer can take everything down.
        With hands-on experience in network software R&D, I build and optimize low-level systems across ACL, IEEE 802.1x, and AAA protocols — focusing on performance, reliability, and how systems behave under real-world conditions.`,
  aboutBio:     "I graduated from KUET in 2024 with a degree in Computer Science & Engineering. Over time, I’ve become particularly interested in how systems work beneath the surface — from networking protocols to backend architecture",
  shortBio:     "Building scalable systems & exploring emerging tech.",
  quote:        "When I'm not engineering software, I enjoy exploring new technologies, contributing to open source, and writing about what I learn.",
  availableForWork: false,
};

export const navItems: NavItem[] = [
  { label: "About",        href: "/#about",        icon: "UserStarIcon"          },
  { label: "Skills",       href: "/#skills",       icon: "SwordsIcon"        },
  { label: "Experience",   href: "/#experience",   icon: "HourglassIcon"     },
  { label: "Expertise",    href: "/#expertise",    icon: "TelescopeIcon"       },
  { label: "Publications", href: "/#publications", icon: "BookOpenCheckIcon"  },
  { label: "Projects",     href: "/projects",     icon: "WebhookIcon"    },
  { label: "Education",    href: "/#education",    icon: "GraduationCapIcon" },
  { label: "Coding",       href: "/#coding",       icon: "TerminalIcon"      },
  { label: "Achievements", href: "/#achievements", icon: "SparklesIcon"        },
  { label: "Blog",         href: "/blog",          icon: "PenToolIcon"       },
  { label: "Contact",      href: "/#contact",      icon: "MailIcon"          },
];

export const experiences: Experience[] = [
  {
    company: "Shanghai BDCOM (Bangladesh)",
    role: "Software Engineer (R&D)",
    duration: "2024 – Present",
    location: "Dhaka, Bangladesh",
    link: "https://www.bdcom.cn",
    description: [
      "Developing and optimizing networking features for embedded systems, focusing on access control and packet-level policy enforcement",
      "Worked on RPC-based synchronization mechanisms between control and line cards in VxWorks, improving reliability of distributed configurations",
      "Designed and enhanced IPACL modules, ensuring efficient rule updates and consistency across hardware components",
      "Integrated and debugged low-level networking protocols using C in Linux/VxWorks environments",
      "Collaborated with cross-functional teams to analyze system behavior, troubleshoot performance issues, and deliver production-grade solutions",
    ],
    technologies: [
      "C",
      "Python",
      "Linux",
      "VxWorks",
      "Networking",
      "RPC",
      "IPACL",
      "RADIUS",
      "PAM"
    ],
  },
  // {
  //   company: "KUET FILM SOCIETY",
  //   role: "Design Secretary",
  //   duration: "2022 – 2024",
  //   location: "Khulna, Bangladesh",
  //   link: "https://www.bdcom.cn",
  //   description: [
  //     "Developing and optimizing networking features for embedded systems, focusing on access control and packet-level policy enforcement",
  //     "Worked on RPC-based synchronization mechanisms between control and line cards in VxWorks, improving reliability of distributed configurations",
  //     "Designed and enhanced IPACL modules, ensuring efficient rule updates and consistency across hardware components",
  //     "Integrated and debugged low-level networking protocols using C in Linux/VxWorks environments",
  //     "Collaborated with cross-functional teams to analyze system behavior, troubleshoot performance issues, and deliver production-grade solutions",
  //   ],
  //   technologies: [
  //     "C",
  //     "Python",
  //     "Linux",
  //     "VxWorks",
  //     "Networking",
  //     "RPC",
  //     "IPACL",
  //     "RADIUS",
  //     "PAM"
  //   ],
  // },
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

// Skill Section Data
import {
  SiCplusplus, SiPython, SiJavascript, SiTypescript,
  SiPostgresql, SiGnubash, SiReact, SiNextdotjs,
  SiTailwindcss, SiNodedotjs, SiLinux, SiGit, SiWireshark,
  SiSubversion ,
} from "react-icons/si";
import { 
  TbBrandJavascript, TbBrandTypescript 
} from "react-icons/tb";
import { Database, Globe, Cpu, Wrench } from "lucide-react";
import { BsCpuFill } from "react-icons/bs";

export const skills: Skill[] = [
  // Languages
  { name: "C/C++",         stars: 5, category: "languages", icon: SiCplusplus         },
  { name: "Python",        stars: 4, category: "languages", icon: SiPython            },
  { name: "JavaScript",    stars: 4, category: "languages", icon: TbBrandJavascript   },
  { name: "TypeScript",    stars: 3, category: "languages", icon: TbBrandTypescript   },
  { name: "SQL",           stars: 4, category: "languages", icon: SiPostgresql        },
  { name: "Bash / Shell",  stars: 4, category: "languages", icon: SiGnubash           },
  // Frontend
  { name: "React",         stars: 4, category: "frontend",  icon: SiReact             },
  { name: "Next.js",       stars: 3, category: "frontend",  icon: SiNextdotjs         },
  { name: "Tailwind CSS",  stars: 4, category: "frontend",  icon: SiTailwindcss       },
  // Backend
  { name: "Node.js",       stars: 3, category: "backend",   icon: SiNodedotjs         },
  { name: "REST API",      stars: 4, category: "backend",   icon: Globe               },
  // Operating System
  { name: "Linux",         stars: 5, category: "os",        icon: SiLinux             },
  { name: "VxWorks",       stars: 5, category: "os",        icon: BsCpuFill           },
  // Tools
  { name: "Git",           stars: 4, category: "tools",     icon: SiGit               },
  { name: "SVN",           stars: 5, category: "tools",     icon: SiSubversion        },
  { name: "GCC / GDB",     stars: 4, category: "tools",     icon: Cpu                 },
  { name: "Wireshark",     stars: 4, category: "tools",     icon: SiWireshark         },
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
    image: "thesis_paper_cover.png",
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
    title: "TFTP Server for VxWorks Switch",
    description: "CLI project for a Switch device to act as a tftp server. It implements the protocol according to the RFC 1350 specification, allowing clients to upload and download files. The server handles multiple concurrent requests, manages file storage, and provides error handling for various scenarios such as file not found or access violations.",
    technologies: ["C", "VxWorks", "Networking", "Embedded Systems", "TFTP Protocol"],
    github: "https://github.com/ShihabKuet/tftp_bdcom",
    featured: false,
    category: "backend",
  },
  {
    title: "Japanese Vocab Learning App (Web & Android)",
    description: "A scalable React app for learning Japanese vocabulary — audio pronunciation, example sentences, Wikipedia images, flashcards, and quizzes. Still growing with new features like spaced repetition",
    technologies: ["JavaScript", "React.js", "Java (Android)"],
    github: "https://github.com/ShihabKuet/japanese-vocab",
    featured: false,
    category: "tools",
  },
  {
    title: "Portfolio Website (This Site!)",
    slug: "portfolio-website",
    description: "Built with Next.js and Tailwind CSS, this portfolio website is designed to showcase my projects, experience, and skills. It features a clean, responsive design with sections for about, skills, experience, projects, education, coding profiles, and achievements. The site also includes SEO optimizations and is deployed on Vercel for fast performance.",
    technologies: ["TypeScript", "Next.js", "Tailwind CSS", "Vercel"],
    github: "https://github.com/ShihabKuet/my-portfolio",
    featured: false,
    category: "frontend",
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
    solved:     100,
    stars:      "5 Star",
    badges:     4,
    certificate: "Problem Solving & SQL (Basic)",
  },
  codeforces: {
    solved:  17,
    rating:  858,
    rank:   "Newbie",
  },
};

export const achievements = [
  {
    title: "Certificate of Excellence (ITEE)",
    issuer: "ITEE",
    date: "October 2024",
    description: "Ranked 2nd in Bangladesh in the ITEE FE Exam",
    credentialUrl: "",           // ← add URL if available
    image: "/certs/fe-exam.jpg", // ← add certificate image if you have it
    category: "certification",
    highlight: true,             // marks it as a featured achievement
  },
  {
    title: "ITEE Level-2 FE Certificate",
    issuer: "ITEE",
    date: "October 2024",
    description: "Passed the FE Computer Engineering exam — a nationally recognized engineering certification. Physical certificate pending collection.",
    credentialUrl: "",           // ← add URL if available
    image: "/certs/fe-exam.jpg", // ← add certificate image if you have it
    category: "certification",
    highlight: true,             // marks it as a featured achievement
  },
  {
    title: "Problem Solving (Basic)",
    issuer: "HackerRank",
    date: "2024",
    description: "Certified in basic-level problem solving covering data structures and algorithms.",
    credentialUrl: "https://www.hackerrank.com/certificates/73ac4ebac062", // ← replace
    image: "",
    category: "certification",
    highlight: false,
  },
  {
    title: "SQL (Basic)",
    issuer: "HackerRank",
    date: "2024",
    description: "Certifiedn in basic-level SQL",
    credentialUrl: "https://www.hackerrank.com/certificates/5ecb69d47dcb",
    image: "",
    category: "certification",
    highlight: false,
  },
];

export { FUN_FACTS } from "./funFacts";