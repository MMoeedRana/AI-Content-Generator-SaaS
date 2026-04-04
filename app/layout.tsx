// @ts-ignore
import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import AppToaster from "@/components/ui/app-toaster";

const inter=Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "PromptForge - AI Content Generator",
  description: "Unleash your creativity with PromptForge, the ultimate AI content generator. Create stunning visuals, engaging text, and more with ease. Try it now and transform your ideas into reality!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={inter.className}
      >
        {children}
        <AppToaster />
      </body>
    </html>
    </ClerkProvider>
  );
}
