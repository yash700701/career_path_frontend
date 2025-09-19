"use client";

import { useState, ChangeEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Highlighter } from "@/components/ui/highlighter";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { AppDispatch } from "@/store/store";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
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
    const [linkedInProfile, setLinkedInProfile] = useState("");
    const [location, setLocation] = useState("");

    const [loading, setLoading] = useState(false);
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

    // Upload and extract resume data
    const handleUpload = async (file: File) => {
        if (!file) {
            toast.info("Please select a file first!");
            return;
        }

        setExtracting(true);
        const formData = new FormData();
        formData.append("resume", file);

        try {
            const response = await axios.post(
                `${port}/api/upload/upload-resume`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(response);
            toast.success(response.data.message || "Resume uploaded.");
        } catch (error: unknown) {
            console.error("Upload failed:", error);
            toast.error("Failed to upload resume.");
        } finally {
            setExtracting(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);

        if (!resumeFile && linkedInProfile.trim() === "") {
            toast.error("Please upload a resume or enter a LinkedIn URL.");
            setLoading(false);
            return;
        }
        if (resumeFile && linkedInProfile.trim() !== "") {
            toast.info(
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

            toast.success(
                response.data.message || "Profile updated successfully!"
            );
            setTimeout(() => {
                router.push("/assessment");
            }, 1000);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message || "An error occurred."
                );
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-2 pt-10 md:px-20 lg:px-36 gap-10 min-h-screen grid grid-cols-1 md:grid-cols-2 items-start my-16 md:my-28">
            {/* Left Section */}
            <div className="space-y-5">
                <h1 className="text-3xl md:text-4xl font-semibold text-blue-950 leading-snug">
                    <Highlighter action="underline" color="#FF9800">
                        Tell Us About You
                    </Highlighter>
                </h1>

                <p className="text-muted-foreground text-pretty text-base md:text-lg mt-4">
                    <Highlighter action="highlight" color="#87CEFA">
                        Help us personalize your career journey
                    </Highlighter>{" "}
                    by sharing some details. The information you provide will
                    allow us to{" "}
                    <Highlighter action="underline" color="#FF9800">
                        recommend the best career paths,
                    </Highlighter>{" "}
                    learning resources, and opportunities{" "}
                    <Highlighter action="highlight" color="#FF9800">
                        tailored to your profile.
                    </Highlighter>
                </p>
            </div>

            {/* Right Section (Form Card) */}
            <Card className="w-full">
                <CardHeader>
                    <CardDescription>
                        We’ll personalize your career journey
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Age & Education */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    {/* Industries */}
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

                    {/* Interests */}
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

                    {/* Resume Upload */}
                    <div className="grid gap-2">
                        <Label>Upload resume or paste LinkedIn URL</Label>
                        <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            disabled={linkedInProfile.trim() !== ""}
                        />
                        <p className="text-xs text-green-600 flex items-center gap-1">
                            {extracting ? (
                                <>
                                    <Loader2 className="animate-spin size-4" />
                                    Extracting skills from resume...
                                </>
                            ) : (
                                "We’ll auto-extract skills."
                            )}
                        </p>
                    </div>

                    {/* Location */}
                    <div className="grid gap-2">
                        <Label>Location</Label>
                        <Input
                            placeholder="City, Country"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            className="flex-1"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save and continue"}
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => router.push("/")}
                        >
                            Skip for now
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
