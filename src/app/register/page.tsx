"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Highlighter } from "@/components/ui/highlighter";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const port = process.env.NEXT_PUBLIC_API_PORT || "http://localhost:5000";

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await axios.post(
                `${port}/api/auth/register`,
                formData
            );
            toast.info(
                response.data.message ||
                    "Registration successful! Check your email."
            );
            setFormData({ name: "", email: "", password: "" });
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
        <div className="flex justify-center my-36">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
                <h2 className="text-3xl font-bold text-center text-blue-950">
                    <Highlighter action="underline" color="#FF9800">
                        Create Account
                    </Highlighter>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            placeholder="John Doe"
                            required
                        />
                    </div>

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
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${
                            loading ? "cursor-not-allowed" : ""
                        } transition duration-200`}
                    >
                        {loading ? "Registering..." : "Create Account"}
                    </Button>
                </form>

                <p className="text-sm text-center text-gray-500">
                    <Highlighter action="highlight" color="#87CEFA">
                        Already have an account?
                    </Highlighter>{" "}
                    <a
                        href="/login"
                        className="text-indigo-600 hover:underline"
                    >
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
