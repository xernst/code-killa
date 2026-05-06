import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import BrainDump from "@/components/BrainDump";
import FollowOnXPill from "@/components/FollowOnXPill";
import LoginToSave from "@/components/LoginToSave";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["SOFT", "WONK"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: {
    default: "promptdojo — free interactive python course",
    template: "%s",
  },
  description:
    "free, open-source python course for people who already use ai to write code. runs in your browser. login to save progress and sync across devices.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${fraunces.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-ink-950 text-ink-100 antialiased font-display">
        <div className="flex flex-wrap items-center justify-end gap-2 px-4 py-2 sm:px-6">
          <LoginToSave />
          <FollowOnXPill />
        </div>
        {children}
        <BrainDump />
      </body>
    </html>
  );
}
