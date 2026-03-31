import Hero from "@/components/sections/Hero";

// This is a Server Component by default (no "use client" needed)
// It runs on the server, which is great for performance
export default function HomePage() {
  return (
    <>
      <Hero />
      {/* More sections will be added here in future phases */}
    </>
  );
}