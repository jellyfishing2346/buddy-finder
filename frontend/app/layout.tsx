import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../src/components/Providers";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buddy Finder",
  description: "A full-stack Instagram clone built with Next.js and Express",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}