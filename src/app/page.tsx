"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import chat from "../../public/chat.png";
import { Highlighter } from "@/components/ui/highlighter";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MagicCard } from "../components/ui/magic-card";
import { useTheme } from "next-themes";

export default function HomePage() {
    const { theme } = useTheme();
    return (
        <div className="space-y-10 px-4 md:px-36">
            <section className="text-center mt-28 text-blue-950 max-w-3xl mx-auto space-y-4">
                <h1 className="text-6xl md:text-[70px] font-semibold text-balance">
                    Your{" "}
                    <Highlighter action="underline" color="#FF9800">
                        AI-Powered
                    </Highlighter>{" "}
                    Career & Skills{" "}
                    <Highlighter action="highlight" color="#87CEFA">
                        Guide
                    </Highlighter>
                </h1>
                <p className="text-muted-foreground text-pretty text-lg">
                    <Highlighter action="highlight" color="#FF9800">
                        Personalized
                    </Highlighter>{" "}
                    <Highlighter action="underline" color="#172554">
                        career roadmap, skill analysis, and job readiness.
                    </Highlighter>
                </p>
                <div className="flex items-center mt-8 justify-center gap-3">
                    <Button asChild className="">
                        <Link href="/onboarding">Get Started</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/assessment">Try Assessment</Link>
                    </Button>
                </div>
            </section>

            <section className="grid md:grid-cols-4 gap-4">
                {[
                    "AI-Powered Career Guidance",
                    "Skill Gap Analysis",
                    "Job Market Trends",
                    "Personalized Roadmap",
                ].map((title) => (
                    <Card key={title} className=" max-w-sm w-full  shadow-none border-none">
                        <MagicCard
                            gradientColor={
                                theme === "dark" ? "#262626" : "#D9D9D955"
                            }
                            className="p-2 "
                        >
                            <CardHeader className="p-4 ">
                                <CardTitle className="text-blue-950 text-lg">{title}</CardTitle>
                                <CardDescription className="mt-3">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore totam, dolor a
                                </CardDescription>
                            </CardHeader>
                        </MagicCard>
                    </Card>
                ))}
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Testimonials</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Student {i}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                This platform clarified my path and gave me
                                actionable steps.
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

             <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-blue-950">Why We Exist</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Overwhelming career choices but lack of personalized guidance.</li>
          <li>Generic counseling ignoring aptitudes and learning styles.</li>
          <li>Skill mismatches and outdated education pathways.</li>
          <li>Access gaps for students from Tier-2/3 cities.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-blue-950">Our Approach</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>AI-powered aptitude quizzes & skill gap analysis.</li>
          <li>Real-time job trends from APIs like LinkedIn and Naukri.</li>
          <li>Personalized learning roadmaps with actionable steps.</li>
          <li>Localized content and mentorship networks.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-blue-950">Get Started</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/profile" className="px-4 py-2 border border-blue-950 text-blue-950 rounded-sm hover:bg-blue-50 transition">
            Setup Your Profile
          </Link>
          <Link href="/assessment" className="px-4 py-2 border border-blue-950 text-blue-950 rounded-sm hover:bg-blue-50 transition">
            Take Assessment
          </Link>
          <Link href="/resources" className="px-4 py-2 border border-blue-950 text-blue-950 rounded-sm hover:bg-blue-50 transition">
            Explore Learning Resources
          </Link>
          <Link href="/trends" className="px-4 py-2 border border-blue-950 text-blue-950 rounded-sm hover:bg-blue-50 transition">
            See Job Market Trends
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-blue-950">What’s Next</h2>
        <p className="text-gray-700">
          Start with a quick profile setup and skill assessment. Based on your strengths and interests, we’ll recommend the most suitable career paths and learning opportunities. Stay updated with industry trends and connect with mentors who can guide you along the way.
        </p>
      </section>

            <div className="fixed bottom-10 p-2 border border-blue-950 rounded-md  bg-white flex gap-3 right-5">
                <p className="text-blue-950 text-sm ">
                    <Highlighter action="underline" color="#FF9800">
                        Personalized chat
                    </Highlighter>
                </p>
                <Image src={chat} alt="chat" className="w-6 h-6" />
            </div>
        </div>
    );
}
