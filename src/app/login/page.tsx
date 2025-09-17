"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice";
import type { AppDispatch } from '@/store/store';

export default function LoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
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
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${port}/api/auth/login`,
                formData
            );
            setMessage(response.data.message || "Login successful!");
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

            // Redirect to dashboard or home page after login
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (err: any) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center mt-24">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-700">
                    Sign In
                </h2>

                {message && (
                    <div className="p-3 text-green-700 bg-green-100 border border-green-300 rounded">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="p-3 text-red-700 bg-red-100 border border-red-300 rounded">
                        {error}
                    </div>
                )}

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
                                className="text-indigo-600 hover:underline"
                            >
                                Forgot Password?
                            </a>
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg text-white font-semibold ${
                            loading
                                ? "bg-indigo-300 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                        } transition duration-200`}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500">
                    Don’t have an account?{" "}
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
