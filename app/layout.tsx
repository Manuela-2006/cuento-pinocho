import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import LenisProvider from "./components/LenisProvider";
import ScrollNose from "./components/ScrollNose";
import AudioControlPanel from "./components/AudioControlPanel";

export const metadata: Metadata = {
  title: "Cuento Pinocho",
  description: "Cuento interactivo",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body suppressHydrationWarning>
        <LenisProvider />
        <ScrollNose />
        <AudioControlPanel />
        {children}
      </body>
    </html>
  );
}
