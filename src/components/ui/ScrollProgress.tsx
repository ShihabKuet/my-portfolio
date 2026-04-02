"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(percent);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-0.5 z-[100] bg-sky-200 dark:bg-zinc-800/50">
      <div
        className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}