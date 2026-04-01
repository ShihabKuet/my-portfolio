"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="class"        // adds "dark" or "light" class to <html>
      defaultTheme="dark"      // start with dark theme
      enableSystem={true}      // respect OS preference
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}