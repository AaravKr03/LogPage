import type { Metadata, Viewport } from "next";
import "@fontsource/cascadia-mono/400.css";
import "@fontsource/cascadia-mono/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "V1YKsBuilds",
  description: "V1YKsBuilds terminal",
};

export const viewport: Viewport = { themeColor: "#04170f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
