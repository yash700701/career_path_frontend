"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Highlighter } from "@/components/ui/highlighter";

export default function VerifyEmailPage() {
    const router = useRouter();
    const { verificationToken } = useParams() as { verificationToken?: string }; // 👈 type it
    const port = process.env.NEXT_PUBLIC_API_PORT;

    useEffect(() => {
        if (!verificationToken) {
            toast.error("No verification token provided.");
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await axios.get(
                    `${port}/api/auth/verify-email/${verificationToken}`
                );

                toast.success(
                    res.data.message || "Email verified successfully!"
                );

                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } catch (err) {
                const error = err as AxiosError<{ message: string }>;
                if (error.response?.data?.message) {
                    console.log(error.response.data.message || "Verification failed.");
                    // toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong. Please try again.");
                }
            }
        };

        verifyEmail();
    }, [verificationToken]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <h1 className="text-3xl font-bold mb-4 text-blue-950">
                    <Highlighter action="underline" color="#FF9800">
                        <p className="">Email Verification</p>
                    </Highlighter>
                </h1>
                <p>
                    Hang tight! We’re verifying your email to keep your account
                    secure and ensure you get the{" "}
                    <Highlighter action="highlight" color="#87CEFA">
                        best personalized experience.
                    </Highlighter>
                </p>
            </div>
        </div>
    );
}
