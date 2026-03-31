import Hero       from "@/components/sections/Hero";
import About      from "@/components/sections/About";
import Skills     from "@/components/sections/Skills";
import Education  from "@/components/sections/Education";
import Experience from "@/components/sections/Experience";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Education />
    </>
  );
}