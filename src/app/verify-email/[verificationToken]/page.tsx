"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { verificationToken } = useParams(); // Get token from URL
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState("");
  const port = process.env.NEXT_PUBLIC_API_PORT

  useEffect(() => {
    if (!verificationToken) {
      setError("No verification token provided.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axios.get(`${port}/api/auth/verify-email/${verificationToken}`);

        setMessage(res.data.message || "Email verified successfully!");

        setTimeout(() => {
          router.push("/login");
        }, 3000); // Redirect after 3 seconds
      } catch (err: any) {
        if (err.response && err.response.data) {
          setError(err.response.data.message || "Verification failed.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    };

    verifyEmail();
  }, [verificationToken, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <p className="text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
}
