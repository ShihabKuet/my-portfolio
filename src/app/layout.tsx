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
  keywords: ["MD SHANJID AREFIN", "Software Engineer", "R&D", "KUET", "CSE", "Portfolio", "Bangladesh"],
  authors: [{ name: personalInfo.name }],

  // Tells Google the definitive URL — prevents duplicate content
  alternates: {
    canonical: "https://shanjid.bd",
  },

  // Search Engine Verification:
  verification: {
    google: "0k9vsROjRTdd3cE5K5cVitay2ixqcsYoQn34CdfNGW0",
    other: {
      "msvalidate.01": "A9330E28F0A58AE0DCE30E1297628AB8",   // bing
    },
  },

  // OpenGraph = what shows up when you share on LinkedIn/WhatsApp/Twitter
  openGraph: {
    title: `${personalInfo.name} | Software Engineer`,
    description: personalInfo.shortBio,
    type: "website",
    url: "https://shanjid.bd",
    siteName: personalInfo.name,
    locale: "en_US",
    images: [
      {
        url: "https://shanjid.bd/opengraph-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${personalInfo.name} | Software Engineer`,
    description: personalInfo.shortBio,
  },

  // This controls Google Search appearance specifically
  metadataBase: new URL("https://shanjid.bd"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // To enable scrolling to top when route transition, remove - data-scroll-behavior="smooth"
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
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
