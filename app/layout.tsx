import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Schibsted_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Schibsted_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
});

const mono = Space_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Asistentul tău AI",
  description:
    "Asistentul tău personal cu AI, în română: CV, interviuri, business și conținut pentru Instagram.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#141210",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
