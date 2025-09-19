"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Marquee } from "../components/ui/marquee";
import { Highlighter } from "@/components/ui/highlighter";
import Image from "next/image";
import user from "../../public/user.png";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import interview from "../../public/christina-wocintechchat-com-LQ1t-8Ms5PY-unsplash.jpg";
import resumeBuilder from "../../public/resume-genius-9si2noVCVH8-unsplash (1).jpg";
import { User, FileText, ClipboardList, Brain, Target } from "lucide-react";
import { useRouter } from "next/navigation";

const steps = [
    {
        title: "Onboarding Form",
        desc: "Fill in your personal details & preferences",
        icon: <User className="h-8 w-8 text-blue-600" />,
    },
    {
        title: "Upload Resume",
        desc: "We auto-extract your skills & experience",
        icon: <FileText className="h-8 w-8 text-purple-600" />,
    },
    {
        title: "Personalized Quiz",
        desc: "Take a short tailored quiz about your interests",
        icon: <ClipboardList className="h-8 w-8 text-green-600" />,
    },
    {
        title: "AI-Powered Analysis",
        desc: "We combine all insights to understand your profile",
        icon: <Brain className="h-8 w-8 text-pink-600" />,
    },
    {
        title: "Career Recommendations",
        desc: "Get your roadmap, skills, and resources",
        icon: <Target className="h-8 w-8 text-orange-600" />,
    },
];

const reviews = [
    {
        name: "Aarav",
        username: "@aarav",
        body: "The quiz + resume analysis was so accurate. I finally got clarity on which roles truly match my skills — I’m now preparing for Data Science roles with confidence.",
    },
    {
        name: "Sophia",
        username: "@sophia",
        body: "I always felt stuck in my career path. This platform gave me personalized recommendations and even a roadmap to follow. It feels like having a career coach 24/7!",
    },
    {
        name: "Rahul",
        username: "@rahul",
        body: "What impressed me was how it extracted skills from my resume and combined them with quiz answers to suggest tailored careers. Super practical and insightful!",
    },
    {
        name: "Emily",
        username: "@emily",
        body: "I loved how the recommendations weren’t generic. It matched my interests with industry demand and gave me resources to start learning immediately.",
    },
    {
        name: "Karan",
        username: "@karan",
        body: "This platform saved me months of confusion. I now have a clear direction and know what skills to build for a Machine Learning Engineer role.",
    },
    {
        name: "Mia",
        username: "@mia",
        body: "The career roadmap was the highlight for me. It broke things down step by step so I don’t feel lost. Perfect for anyone serious about their future.",
    },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);
const ReviewCard = ({
    name,
    username,
    body,
}: {
    name: string;
    username: string;
    body: string;
}) => {
    return (
        <figure
            className={cn(
                "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                // light styles
                "border-gray-950/[.1] hover:bg-gray-950/[.05]"
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <Image
                    className="rounded-full"
                    width="28"
                    height="28"
                    alt=""
                    src={user}
                />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40">
                        {username}
                    </p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm">{body}</blockquote>
        </figure>
    );
};

export default function HomePage() {
    const router = useRouter();
    const handleClick = () => {
        router.push("/onboarding");
    };
    return (
        <div className="space-y-10 px-2 md:px-36">
            <section className="text-center mt-28 text-blue-950 max-w-3xl mx-auto space-y-4">
                <h1 className="text-5xl md:text-[70px] font-semibold text-balance">
                    Your{" "}
                    <Highlighter action="underline" color="#FF9800">
                        <p className="italic">AI-Powered</p>
                    </Highlighter>{" "}
                    Career & Skills{" "}
                    <Highlighter action="highlight" color="#87CEFA">
                        Guide
                    </Highlighter>
                </h1>
                <p className="text-muted-foreground text-pretty pt-5 text-lg">
                    <Highlighter action="highlight" color="#FF9800">
                        Personalized
                    </Highlighter>{" "}
                    <Highlighter action="underline" color="#172554">
                        career roadmap,
                    </Highlighter>{" "}
                    <Highlighter action="underline" color="#172554">
                        skill analysis,
                    </Highlighter>{" "}
                    <Highlighter action="underline" color="#172554">
                        and job readiness.
                    </Highlighter>
                </p>
                <div className="flex items-center mt-8 justify-center gap-3">
                    <Button onClick={handleClick}>Get Started</Button>
                    <Button asChild>
                        <Link href="/assessment">Try Assessment</Link>
                    </Button>
                </div>
            </section>

            <section className="grid md:grid-cols-4 gap-3">
                {[
                    "AI-Powered Career Guidance",
                    "Skill Gap Analysis",
                    "Job Market Trends",
                    "Personalized Roadmap",
                ].map((title) => (
                    <Card
                        key={title}
                        className=" max-w-sm w-full border shadow"
                    >
                        <CardHeader className="p-4 ">
                            <CardTitle className="text-blue-950 text-lg">
                                {title}
                            </CardTitle>
                            <CardDescription className="mt-3">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Inventore totam, dolor a
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </section>

            <section className="py-10">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-semibold text-blue-950">
                        Your Career Journey in{" "}
                        <Highlighter action="underline" color="#FF9800">
                            5 Simple Steps
                        </Highlighter>
                    </h1>

                    <div className="grid md:grid-cols-3 mt-10 gap-3">
                        {steps.map((step, i) => (
                            <Card
                                key={i}
                                className="border shadow flex flex-col"
                            >
                                <CardContent className=" flex flex-col items-center justify-center text-center space-y-4 flex-1">
                                    <div>{step.icon}</div>
                                    <h3 className="font-semibold text-lg">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {step.desc}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="">
                <div className="container mx-auto grid md:grid-cols-2 items-center gap-12">
                    {/* Left Content */}
                    <div className="space-y-6">
                        <h1 className="text-4xl font-semibold text-blue-950">
                            {" "}
                            Ace Your Next{" "}
                            <Highlighter action="underline" color="#FF9800">
                                Interview
                            </Highlighter>
                        </h1>
                        <p className="text-muted-foreground text-pretty text-lg">
                            Prepare with confidence using our curated interview
                            questions, mock tests, and personalized guidance.
                            Whether you’re aiming for tech, business, or
                            creative roles — we’ve got you covered.
                        </p>
                        <Link href="tools/interview">
                            <Button size="lg" className="">
                                Start Preparing
                            </Button>
                        </Link>
                    </div>

                    {/* Right Image */}
                    <div className="flex justify-center">
                        <Image
                            src={interview}
                            alt="Interview Preparation"
                            width={450}
                            height={350}
                            className="rounded-2xl shadow-lg"
                        />
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto grid md:grid-cols-2 items-center gap-12">
                    {/* Left Content */}
                    <div className="space-y-6">
                        <h1 className="text-4xl font-semibold text-blue-950">
                            Build Your{" "}
                            <Highlighter action="underline" color="#FF9800">
                                AI-Powered Resume
                            </Highlighter>
                        </h1>
                        <p className="text-muted-foreground text-pretty text-lg">
                            Create or tailor a professional resume aligned with
                            your chosen career path. Our AI ensures your resume
                            highlights your strengths, matches industry
                            standards, and gets noticed by recruiters.
                        </p>
                        <Link href="/tools/resume">
                            <Button size="lg" className="">
                                Start Building
                            </Button>
                        </Link>
                    </div>

                    {/* Right Image */}
                    <div className="flex justify-center">
                        <Image
                            src={resumeBuilder}
                            alt="AI Resume Builder"
                            width={450}
                            height={350}
                            className="rounded-2xl shadow-lg"
                        />
                    </div>
                </div>
            </section>

            <section className="">
                <div className="container mx-auto grid md:grid-cols-2 items-center gap-12">
                    {/* Left Content */}
                    <div className="space-y-6">
                        <h1 className="text-4xl font-semibold text-blue-950">
                            {" "}
                            Your Personal Career{" "}
                            <Highlighter action="underline" color="#FF9800">
                                Chatbot
                            </Highlighter>
                        </h1>
                        <p className="text-muted-foreground text-pretty text-lg">
                            Get instant answers, personalized guidance, and
                            step-by-step support for your career journey. Our
                            AI-powered chatbot is always ready to help you with
                            interview tips, resume feedback, or career advice —
                            anytime you need it.
                        </p>
                        <Link href="/chat">
                            <Button size="lg" className="">
                                Chat Now
                            </Button>
                        </Link>
                    </div>

                    {/* Right Content (Optional placeholder for balance) */}
                    <div className="hidden md:flex justify-center">
                        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-10 text-center shadow-inner w-full h-full flex items-center justify-center">
                            <p className="text-blue-950 font-medium text-lg">
                                💬 Always here to guide you
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-4 pt-10">
                <h1 className="text-4xl font-semibold text-blue-950">
                    {" "}
                    <Highlighter action="underline" color="#FF9800">
                        Testimonials
                    </Highlighter>
                </h1>
                <p className="text-muted-foreground text-pretty text-lg">
                    Don’t just take our word for it — hear from students,
                    graduates, and professionals who have discovered their ideal
                    career paths through our platform. Their stories highlight
                    how personalized recommendations and structured roadmaps
                    made their journeys clearer, faster, and more achievable.
                </p>

                <div className="mt-5 relative flex w-full flex-col items-center justify-center overflow-hidden">
                    <Marquee pauseOnHover className="[--duration:20s]">
                        {firstRow.map((review) => (
                            <ReviewCard key={review.username} {...review} />
                        ))}
                    </Marquee>
                    <Marquee reverse pauseOnHover className="[--duration:20s]">
                        {secondRow.map((review) => (
                            <ReviewCard key={review.username} {...review} />
                        ))}
                    </Marquee>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
                </div>
            </section>
        </div>
    );
}
