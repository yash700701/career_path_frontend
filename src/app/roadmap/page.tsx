"use client";

import { CheckCircle2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Badge } from "@/components/ui/badge";
import { Highlighter } from "@/components/ui/highlighter";

interface Career {
    title: string;
    industry: string;
    matchScore: number;
    whyRecommended: string;
    requiredSkills: string[];
    averagePackage: string;
    futureScope: string;
    learningResources: { name: string; link: string; type: string }[];
    roadmap: string[];
}

export default function RoadmapIndex() {
    const [recommendations, setRecommendations] = useState<Career[]>([]);
    const token = useSelector((state: RootState) => state.auth.token);
    const port = process.env.NEXT_PUBLIC_API_PORT;

    useEffect(() => {
        const getRecommendations = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                };

                const response = await axios.get(
                    `${port}/api/career/get-generatedRecommendation`,
                    { headers }
                );

                if (response.data) {
                    setRecommendations(
                        response.data.profile.recommendedCareers
                    );
                }
            } catch (err) {
                console.error("Failed to get career recommendation:", err);
            }
        };
        getRecommendations();
    }, []);
    return (
        <div className="space-y-4 px-2 md:px-36 mt-24">
            <h1 className="text-4xl font-semibold text-blue-950">
                {" "}
                <Highlighter action="underline" color="#FF9800">
                    Personalized Roadmaps
                </Highlighter>
            </h1>
            
            <p className="text-muted-foreground text-pretty text-lg">
                
                <Highlighter action="highlight" color="#87CEFA">
                    Get step-by-step learning plans
                </Highlighter>{" "}
                based on your skills and goals.
                We help you stay on track with clear actions, resources, and
                milestones to{" "} 
                <Highlighter action="underline" color="#FF9800">
                    build the career you want.
                </Highlighter>
                
            </p>
            <div className="grid md:grid-cols-2 gap-5 my-16">
                {recommendations?.map((rec, idx) => (
                    <Card
                        key={idx}
                        className="shadow-md hover:shadow-lg transition rounded-2xl"
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                {rec.title}
                                <Badge variant="secondary">
                                    {rec.matchScore}% Match
                                </Badge>
                            </CardTitle>
                            <CardDescription>{rec.industry}</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Roadmap */}
                            {rec.roadmap?.length > 0 && (
                                <div>
                                    <p className="font-semibold text-gray-900 mb-3 text-base">
                                        Roadmap
                                    </p>

                                    <div className="space-y-4">
                                        {rec.roadmap.map((step, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-3"
                                            >
                                                {/* Step icon */}
                                                <div className="flex flex-col items-center">
                                                    <CheckCircle2 className="w-5 h-5 text-blue-950" />
                                                </div>

                                                {/* Step content */}
                                                <div className="bg-blue-50 rounded-lg p-3 shadow-sm flex-1">
                                                    <p className="text-sm text-gray-800 font-medium">
                                                        Step {i + 1}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {step}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
