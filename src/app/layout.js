import { Lexend, Inter } from "next/font/google";
import { Sorts_Mill_Goudy } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sortsMillGoudy = Sorts_Mill_Goudy({
  variable: "--font-sorts-mill-goudy",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "Glassbox",
  description: "Deploy, manage, and scale AI agents with enterprise-grade infrastructure",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${lexend.variable} ${inter.variable} ${sortsMillGoudy.variable} antialiased font-lexend`}
      >
        {children}
      </body>
    </html>
  );
}
