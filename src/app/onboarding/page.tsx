"use client";

import { useState, ChangeEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function OnboardingPage() {
    const router = useRouter();
    const token = useSelector((state: RootState) => state.auth.token || "");

    const [age, setAge] = useState("");
    const [educationLevel, setEducationLevel] = useState("");
    const [preferredIndustries, setPreferredIndustries] = useState("");
    const [interests, setInterests] = useState("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumeMessage, setResumeMessage] = useState("");
    const [linkedInProfile, setLinkedInProfile] = useState("");
    const [location, setLocation] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [extracting, setExtracting] = useState(false);

    const port = process.env.NEXT_PUBLIC_API_PORT || "";

    // Handler for resume upload
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setResumeFile(file);
        if (file) {
            setLinkedInProfile(""); // Clear LinkedIn URL if a file is selected
            handleUpload(file);
        }
    };

    // Handler for LinkedIn URL input
    const handleLinkedInChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLinkedInProfile(e.target.value);
        if (e.target.value) {
            setResumeFile(null); // Clear resume file if URL is entered
            handleLinkedInSubmit(e.target.value);
        }
    };

    // extract data from linkedin
    const handleLinkedInSubmit = async (url: String) => {
        if (!url) return;
        setExtracting(true);
        try {
            const response = await fetch(`${port}/api/upload/extract-linkedin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ url }),
            });
            const data = await response.json();
            console.log("Extracted LinkedIn data:", data);
        } catch (error) {
            console.error("LinkedIn extraction failed:", error);
        } finally {
            setExtracting(false);
        }
    };

    // Upload and extract resume data
    const handleUpload = async (file: File) => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        setExtracting(true);
        const formData = new FormData();
        formData.append("resume", file); // 'resume' should match multer field name

        try {
            const response = await axios.post(
                `${port}/api/upload-resume`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setResumeMessage(response.data.message || "Resume uploaded.");
        } catch (error: unknown) {
            console.error("Upload failed:", error);
            setResumeMessage("Failed to upload resume.");
        } finally {
            setExtracting(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        setMessage("");

        if (!resumeFile && linkedInProfile.trim() === "") {
            setError("Please upload a resume or enter a LinkedIn URL.");
            setLoading(false);
            return;
        }
        if (resumeFile && linkedInProfile.trim() !== "") {
            setError(
                "Please provide only one option: either resume or LinkedIn URL."
            );
            setLoading(false);
            return;
        }

        try {
            const data = {
                age: age ? parseInt(age, 10) : undefined,
                educationLevel,
                interests: interests
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                preferredIndustries: preferredIndustries
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                linkedInProfile,
                location,
            };

            const response = await axios.put(
                `${port}/api/profile/setup`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage(
                response.data.message || "Profile updated successfully!"
            );
            setTimeout(() => {
                router.push("/assessment");
            }, 1000);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || "An error occurred.");
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto min-h-screen flex items-center justify-center p-4 mt-20">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Tell us about you</CardTitle>
                    <CardDescription>
                        We’ll personalize your career journey
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                min={14}
                                max={99}
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Education level</Label>
                            <Select
                                onValueChange={setEducationLevel}
                                value={educationLevel}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="High School">
                                        High School
                                    </SelectItem>
                                    <SelectItem value="Undergraduate">
                                        Undergraduate
                                    </SelectItem>
                                    <SelectItem value="Postgraduate">
                                        Postgraduate
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Preferred industries</Label>
                        <Input
                            placeholder="e.g., Data, Software, Design"
                            value={preferredIndustries}
                            onChange={(e) =>
                                setPreferredIndustries(e.target.value)
                            }
                        />
                        <p className="text-xs text-muted-foreground">
                            Separate multiple industries with commas.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label>Interests</Label>
                        <Textarea
                            placeholder="e.g., AI, Open-source, Cloud computing"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Separate multiple interests with commas.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label>Upload resume or paste LinkedIn URL</Label>
                        <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            disabled={linkedInProfile.trim() !== ""}
                        />
                        {resumeMessage && (
                            <p className="text-sm text-green-600">
                                {resumeMessage}
                            </p>
                        )}
                        <Input
                            placeholder="https://www.linkedin.com/in/your-handle"
                            value={linkedInProfile}
                            onChange={handleLinkedInChange}
                            disabled={resumeFile !== null}
                        />
                        <p className="text-xs text-muted-foreground">
                            {extracting
                                ? "Extracting skills from resume..."
                                : "We’ll auto-extract skills."}
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label>Location</Label>
                        <Input
                            placeholder="City, Country"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            className="bg-brand text-white hover:bg-brand/90"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save and continue"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push("/dashboard")}
                        >
                            Skip for now
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
