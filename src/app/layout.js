import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Projeto Integrador - Dashboard SENAI",
  description: "Dashboard desenvolvido pelos alunos de ADS do SENAI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-800 min-h-screen`}
      >
        <div className="bg-gradient-to-b from-white to-gray-100 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
