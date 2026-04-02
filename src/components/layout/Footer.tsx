import { personalInfo, navItems } from "@/data";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Mail, Code2, Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-sky-200 dark:border-zinc-800/50 bg-sky-100/50 dark:bg-zinc-950/500 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="grid sm:grid-cols-3 gap-8 mb-10">

          {/* Brand */}
          <div>
            <a href="/" className="flex items-center gap-2 text-sky-950 dark:text-zinc-100 font-bold text-lg mb-3">
              <Code2 size={20} className="text-violet-500" />
              <span className="font-mono">
                {personalInfo.name.split(" ")[0]}
                <span className="text-violet-500">.</span>
              </span>
            </a>
            <p className="text-sky-500 dark:text-zinc-500 text-sm leading-relaxed">
              {personalInfo.shortBio}
            </p>
          </div>

          {/* Nav links */}
          <div>
            <p className="text-sky-700 dark:text-zinc-400 font-medium text-sm mb-4">Navigation</p>
            <ul className="space-y-2">
              {navItems.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sky-500 dark:text-zinc-500 hover:text-violet-400 transition-colors text-sm font-mono">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-sky-700 dark:text-zinc-400 font-medium text-sm mb-4">Connect</p>
            <div className="flex flex-col gap-3">
              {[
                { icon: <FaGithub size={15} />,   label: "GitHub",   href: personalInfo.github   },
                { icon: <FaLinkedin size={15} />, label: "LinkedIn", href: personalInfo.linkedin },
                { icon: <Mail size={15} />,       label: "Email",    href: `mailto:${personalInfo.email}` },
              ].map(({ icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sky-500 dark:text-zinc-500 hover:text-violet-400 transition-colors text-sm">
                  {icon}
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-sky-200 dark:border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-sky-400 dark:text-zinc-600 text-xs font-mono">
          <p>© {year} {personalInfo.name}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart size={11} className="text-violet-500 fill-violet-500" /> using Next.js & Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}
