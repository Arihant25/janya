import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import "./main.css";
import MaterialWebProvider from "./components/MaterialWebProvider";
import { AuthProvider } from "@/contexts/AuthContext";

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Janya - AI Journalling App",
  description: "Transform your thoughts into insights with Janya's AI-powered journalling experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body
        className={`${roboto.variable} antialiased`}
      >
        <MaterialWebProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MaterialWebProvider>
      </body>
    </html>
  );
}
