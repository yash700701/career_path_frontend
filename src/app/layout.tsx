"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type React from "react";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Suspense } from "react";
import { Poppins } from "next/font/google";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/store";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
    weight: ["400", "700"], // Specify font weights you need
    subsets: ["latin"], // Specify language subsets
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased ${poppins.className}`}
            >
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <SiteHeader />
                            <main className="container mx-auto px-4 py-6">
                                {children}
                            </main>
                            <Toaster richColors />
                            <SiteFooter />
                        </Suspense>
                    </PersistGate>
                </Provider>
                <Analytics />
            </body>
        </html>
    );
}
