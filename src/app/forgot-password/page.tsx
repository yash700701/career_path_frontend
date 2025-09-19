"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Highlighter } from "@/components/ui/highlighter";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const port = process.env.NEXT_PUBLIC_API_PORT;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${port}/api/auth/reset-password`,
                { email }
            );

            toast.info(
                response.data.message ||
                    "Check your email for reset instructions."
            );
            setEmail("");
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
        <div className="flex items-center justify-center my-36">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center text-blue-950">
                    <Highlighter action="underline" color="#FF9800">
                        Reset Password
                    </Highlighter>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            placeholder="email@example.com"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${
                            loading ? "cursor-not-allowed" : ""
                        } transition duration-200`}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
