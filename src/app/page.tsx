import Hero         from "@/components/sections/Hero";
import About        from "@/components/sections/About";
import Skills       from "@/components/sections/Skills";
import Education    from "@/components/sections/Education";
import Experience   from "@/components/sections/Experience";
import Projects     from "@/components/sections/Projects";
import Blog         from "@/components/sections/Blog";
import Contact      from "@/components/sections/Contact";
import Publications from "@/components/sections/Publications";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Publications />
      <Projects />
      <Education />
      <Blog />
      <Contact />
    </>
  );
}