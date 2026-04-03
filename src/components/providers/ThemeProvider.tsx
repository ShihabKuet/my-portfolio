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
      enableColorScheme={false} // By default next-themes injects a <script> tag to sync the browser's native color scheme with our theme — that's what triggers the warning. Disabling it removes the script injection. Our dark/light toggle still works perfectly because we're using the class attribute method, not the native color scheme API.
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}