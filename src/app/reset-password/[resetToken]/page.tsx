"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Highlighter } from "@/components/ui/highlighter";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
    const router = useRouter();
    const { resetToken } = useParams() as { resetToken?: string }; // 👈 typed params

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const port = process.env.NEXT_PUBLIC_API_PORT;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${port}/api/auth/reset-password/${resetToken}`,
                { password }
            );

            toast.success(response.data.message || "Password reset successful");
            setPassword("");
            setConfirmPassword("");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>; // 👈 typed error
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex my-36 justify-center">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center text-blue-950">
                    <Highlighter action="underline" color="#FF9800">
                        Reset Password
                    </Highlighter>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            placeholder="Enter new password"
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            placeholder="Confirm new password"
                            required
                            minLength={6}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${loading ? " cursor-not-allowed" : ""} transition duration-200`}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
