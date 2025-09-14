import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata = {
  title: "Glassbox",
  description: "Deploy, manage, and scale AI agents with enterprise-grade infrastructure",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${lexend.variable} antialiased font-lexend`}
      >
        {children}
      </body>
    </html>
  );
}
