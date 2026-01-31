import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import LenisProvider from "./components/LenisProvider";
import ScrollNose from "./components/ScrollNose";

export const metadata: Metadata = {
  title: "Cuento Pinocho",
  description: "Cuento interactivo",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <LenisProvider />
        <ScrollNose />
        {children}
      </body>
    </html>
  );
}
