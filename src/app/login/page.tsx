"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice";
import type { AppDispatch } from "@/store/store";
import { Highlighter } from "@/components/ui/highlighter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const port = process.env.NEXT_PUBLIC_API_PORT;
    const dispatch = useDispatch<AppDispatch>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${port}/api/auth/login`,
                formData
            );

            toast.success(response.data.message || "Login successful!");
            setFormData({ email: "", password: "" });

            dispatch(
                setCredentials({
                    user: {
                        name: response.data.name,
                        email: response.data.email,
                    },
                    token: response.data.token,
                })
            );

            // Redirect to dashboard/home
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>; // 👈 Typed error
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
                <h2 className="text-3xl font-bold text-center text-blue-950">
                    <Highlighter action="underline" color="#FF9800">
                        Signin
                    </Highlighter>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            placeholder="email@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            placeholder="Enter your password"
                            required
                            minLength={6}
                        />
                        <p className="text-sm text-right">
                            <a
                                href="/forgot-password"
                                className="text-blue-950 hover:underline"
                            >
                                Forgot Password?
                            </a>
                        </p>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${
                            loading ? "cursor-not-allowed" : ""
                        } transition duration-200`}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                <p className="text-sm text-center text-gray-500">
                    <Highlighter action="highlight" color="#87CEFA">
                        Don’t have an account?
                    </Highlighter>{" "}
                    <a
                        href="/register"
                        className="text-indigo-600 hover:underline"
                    >
                        Create one
                    </a>
                </p>
            </div>
        </div>
    );
}
