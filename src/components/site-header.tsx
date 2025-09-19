"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import User from "../../public/user.png";
import menu from "../../public/app.png";
import type { RootState, AppDispatch } from "@/store/store";
import logo from "../../public/CareerPath_Logo_Design-removebg-preview.png";
import Image from "next/image";

const nav = [
    { href: "/", label: "Home" },
    { href: "/assessment", label: "Assessment" },
    { href: "/roadmap", label: "Roadmaps" },
    { href: "/skills", label: "Skills Hub" },
    { href: "/trends", label: "Trends" },
    { href: "/tools/resume", label: "Resume" },
    { href: "/tools/interview", label: "Interview" },
];

export function SiteHeader() {
    const [open, setOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const handleLogout = () => {
        dispatch(logout());
        setProfileMenuOpen(false);
    };

    return (
        <header className="z-50 border-b bg-background/20 w-full fixed top-0 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 md:px-36 h-20 flex items-center justify-between">
                <Link href="/" className="font-semibold text-lg">
                    <Image src={logo} alt="logo" className="sm:h-12 sm:w-32 h-10 w-28 " />
                </Link>

                <nav className="hidden md:flex items-center gap-4">
                    {nav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-md text-muted-foreground hover:text-blue-950 hover:text-lg hover:font-bold transition-all duration-300 ease-in-out"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2 relative">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setProfileMenuOpen(!profileMenuOpen)
                                }
                                className="p-1 cursor-pointer"
                            >
                                <Image
                                    src={User}
                                    alt="user"
                                    className="w-7 h-7 mt-2"
                                />
                            </button>
                            {profileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() =>
                                            setProfileMenuOpen(false)
                                        }
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-1 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Button
                            asChild
                            variant="ghost"
                            className="hidden md:inline-flex"
                        >
                            <Link href="/login">Sign in</Link>
                        </Button>
                    )}

                    <Button asChild>
                        <Link href="/onboarding">Get Started</Link>
                    </Button>
                    <button
                        aria-label="Toggle Menu"
                        className={cn("md:hidden p-2 rounded hover:bg-muted")}
                        onClick={() => setOpen((v) => !v)}
                    >
                        <Image src={menu} alt="user" className="w-7 h-7 mt-2" />
                    </button>
                </div>
            </div>

            {open && (
                <div className="md:hidden border-t p-5">
                    <div className="container mx-auto px-4 py-3 grid grid-cols-2 gap-3">
                        {nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-md text-muted-foreground hover:text-blue-950 hover:text-lg hover:font-bold transition-all duration-300 ease-in-out"
                                onClick={() => setOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        {user ? (
                            <>
                                <button
                                    className="text-sm text-red-600 hover:text-red-700"
                                    onClick={() => {
                                        handleLogout();
                                        setOpen(false);
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="text-sm text-muted-foreground hover:text-foreground"
                                onClick={() => setOpen(false)}
                            >
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
