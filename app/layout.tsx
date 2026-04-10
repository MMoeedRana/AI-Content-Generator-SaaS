// @ts-ignore
import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import AppToaster from "@/components/ui/app-toaster";
import { ThemeProvider } from "./dashboard/_components/theme-provider";

const inter=Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "GenFlow AI - AI Content Generator",
  description: "Unleash your creativity with GenFlow AI, the ultimate AI content generator. Create stunning visuals, engaging text, and more with ease. Try it now and transform your ideas into reality!",
  icons: {
    icon: "/icon.png", 
    apple: "/icon.png", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.className}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        {children}
        <AppToaster />
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
