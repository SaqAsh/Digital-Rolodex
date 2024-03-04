"use client";

import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <NextUIProvider className={"h-full w-full"}>
            {children}
          </NextUIProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
