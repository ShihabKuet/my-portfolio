import type { Metadata }         from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar                    from "@/components/layout/Navbar";
import Footer                    from "@/components/layout/Footer";
import ScrollProgress            from "@/components/ui/ScrollProgress";
import BackToTop                 from "@/components/ui/BackToTop";
import ThemeProvider             from "@/components/providers/ThemeProvider";
import { personalInfo }          from "@/data";
import FloatingTerminal          from "@/components/ui/FloatingTerminal";

// Google Fonts — loaded efficiently by Next.js (zero layout shift)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jetbrains",
});

// Metadata = what Google and social media see when sharing your link
export const metadata: Metadata = {
  title: `${personalInfo.name} | Software Engineer`,
  description: personalInfo.bio,
  keywords: ["Software Engineer", "R&D", "KUET", "Portfolio", "Bangladesh"],
  authors: [{ name: personalInfo.name }],

  // Google Search Engine Verification:
  verification: {
    google: "roRt5OCysppLvJFSam2eMT3fIRZqP3p2Q7FZQU4Cj-c", // ← replace with your string
  },

  // URL bar icon
  icons: {
    icon: "/icon.svg",
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },

  // OpenGraph = what shows up when you share on LinkedIn/WhatsApp/Twitter
  openGraph: {
    title: `${personalInfo.name} | Software Engineer`,
    description: personalInfo.shortBio,
    type: "website",
  },

  // This controls Google Search appearance specifically
  metadataBase: new URL("https://shanjidarefin.vercel.app"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <ScrollProgress />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <BackToTop />
          <FloatingTerminal />
        </ThemeProvider>
      </body>
    </html>
  );
}
