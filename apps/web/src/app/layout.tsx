import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { ThemeProvider } from "@/infrastructure/providers";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-headline",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: `${siteConfig.name} — Engineering Sensory Experiences`,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} min-h-screen bg-surface-base font-body text-text-primary antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
