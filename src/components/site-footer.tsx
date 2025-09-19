"use client";

import Link from "next/link";
import { useState } from "react";

export function SiteFooter() {
    const [message] = useState("");
    // const port = process.env.NEXT_PUBLIC_API_PORT || "";
    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         const check = async () => {
    //             try {
    //                 const response = await axios.get(
    //                     `${port}/api/health` // Replace with your actual endpoint
    //                 );
    //                 if (response.data.running) {
    //                     setMessage("System is healthy");
    //                 } else {
    //                     setMessage("System is not healthy");
    //                 }
    //             } catch (error) {
    //                 console.error("Check failed:", error);
    //                 setMessage("Failed to connect with server");
    //             }
    //         };
    //         check();
    //     }, 5000); // Runs every 5 seconds

    //     return () => clearInterval(intervalId); // Cleanup on unmount
    // }, [port]);
    return (
        <footer className="border-t bg-white w-full px-4 md:px-36">
            <div className="container mx-auto p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                    <p>© {new Date().getFullYear()} CareerPath</p>

                    <p>
                        <span className="text-green-600 text-lg">● </span>system
                        is healthy {message}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/community">Community</Link>
                    <Link href="/trends">Market Trends</Link>
                    <Link href="/admin">Admin</Link>
                </div>
            </div>
        </footer>
    );
}
