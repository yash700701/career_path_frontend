"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { setQuizCompleted } from "../../store/authSlice";
import { RootState, AppDispatch } from "@/store/store"; // ensure this is correctly exported from your store
import { Highlighter } from "@/components/ui/highlighter";

const data = [
    { subject: "Analysis", A: 80 },
    { subject: "Coding", A: 70 },
    { subject: "Design", A: 55 },
    { subject: "Communication", A: 75 },
    { subject: "Leadership", A: 50 },
];

type HistoryItem = {
    role: "user" | "model";
    parts: { text: string }[];
};

export default function AssessmentPage() {
    const token = useSelector((state: RootState) => state.auth.token);
    const quizCompleted = useSelector(
        (state: RootState) => state.auth.quizCompleted
    );

    const [quizId, setQuizId] = useState("");

    const dispatch = useDispatch<AppDispatch>();
    const port = process.env.NEXT_PUBLIC_API_PORT;
    const [quizStarted, setQuizStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingGemini, setLoadingGemini] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [generatingQuestion, setGeneratingQuestion] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [userDetail, setUserDetail] = useState(
        "user is intrested in software development and ai , he is good at coding and analysis, he has leadership qualities, he is also good at communication, he has done btech in computer science, he is 22 years old, he lives in delhi, india, he has interned at google as a software engineer intern, he is looking for roles in product based companies, he has skills in python, javascript, react, nodejs, expressjs, mongodb, mysql, html, css, figma, photoshop, excel, powerpoint, data structures and algorithms, he is also good at problem solving, he has good logical thinking, he is also good at mathematics, he is also good at statistics, he is also good at data analysis, he is also good at data visualization, he is also good at machine learning, he is also good at deep learning, he is also good at ai, he is also good at cloud computing, he is also good at devops, he is also good at linux, he is also good at git, he is also good at github, he is also good at docker, he is also good at kubernetes, he is also good at aws, he is also good at azure, he is also good at gcp, he is also good at terraform, he is also good at ansible, he is also good at jenkins, he is also good at ci/cd, he is also good at agile methodologies, he is also good at scrum, he is also good at kanban, he is also good at project management, he is also good at teamwork, he is also good at leadership qualities"
    );
    const [questionIndex, setQuestionIndex] = useState(0);
    const [isQuizOver, setIsQuizOver] = useState(false);

    const nextQuestion = async () => {
        setGeneratingQuestion(true);
        try {
            const response = await axios.post(
                `${port}/api/quiz/quiz-handler`,
                {
                    history: history,
                    userDetail: userDetail,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = response.data;

            if (data.error) {
                console.error(data.error);
                alert("Error generating question");
                return;
            }

            setCurrentQuestion(data.text);

            // Add user's question
            setHistory((prev) => [
                ...prev,
                { role: "user", parts: [{ text: currentQuestion }] },
            ]);

            // Add AI's response
            setHistory((prev) => [
                ...prev,
                { role: "user", parts: [{ text: currentQuestion }] },
                { role: "model", parts: [{ text: data.text }] },
            ]);
        } catch (err) {
            console.error("Failed to generate question:", err);
            alert("Error generating question");
        } finally {
            setGeneratingQuestion(false);
        }
    };

    const createQuiz = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${port}/api/quiz/create-quiz`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setQuizStarted(true);
                setQuestionIndex(0);
                setIsQuizOver(false);
                setQuizId(response.data.quizId);
                dispatch(setQuizCompleted({ quizCompleted: false }));
                // save quiz id response.data.quizId
                nextQuestion();
            }
        } catch (error) {
            console.error("Failed to start quiz:", error);
            alert("Failed to start quiz.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (questionIndex > 9) {
            setIsQuizOver(true);
            dispatch(setQuizCompleted({ quizCompleted: true }));
            setCurrentQuestion("Quiz completed!");
            return;
        }

        setLoadingGemini(true);

        try {
            const response = await axios.post(
                `${port}/api/quiz/${quizId}/answer`,
                {
                    question: currentQuestion,
                    answer: answer,
                    questionIndex: questionIndex,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = response.data;

            if (data.completed) {
                setIsQuizOver(true);
                dispatch(setQuizCompleted({ quizCompleted: true }));
                setCurrentQuestion("Quiz completed!");
            } else {
                setCurrentQuestion(data.question);
                setAnswer("");
                setQuestionIndex((prev) => prev + 1);
                nextQuestion();
            }
        } catch (error) {
            console.error("Error saving rrecords:", error);
        } finally {
            setLoadingGemini(false);
        }
    };

    return (
        <div className="space-y-6 px-4 md:px-36 mt-24 mb-10">
            <h1 className="text-4xl font-semibold text-blue-950">
                {" "}
                <Highlighter action="underline" color="#FF9800">
                    Career Assessment
                </Highlighter>
            </h1>
            <p className="text-muted-foreground text-pretty text-lg">
                Discover your strengths, interests, and skill gaps through{" "}
                <Highlighter action="highlight" color="#FF9800">
                    tailored quizzes and tests.
                </Highlighter>{" "}
                Get personalized insights to guide you toward the{" "}
                <Highlighter action="highlight" color="#87CEFA">
                    right career and learning opportunities.
                </Highlighter>
            </p>
            <Tabs defaultValue="skills" className="space-y-6">
                <TabsList className="flex flex-wrap">
                    <TabsTrigger value="skills">
                        Step 1: Skills & Interests
                    </TabsTrigger>
                    <TabsTrigger value="paths">
                        Step 2: Career Recommendations
                    </TabsTrigger>
                </TabsList>

                {/* Tab: Skills */}
                <TabsContent value="skills" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-blue-950 text-xl">
                                    AI Personality & Interest Quiz
                                </CardTitle>
                                <CardDescription>
                                    <Highlighter
                                        action="underline"
                                        color="#FF9800"
                                    >
                                        Quick career-focused assessment
                                    </Highlighter>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {!quizCompleted ? (
                                    <>
                                        {isQuizOver || quizCompleted ? (
                                            <Button
                                                onClick={createQuiz}
                                                disabled={loading}
                                            >
                                                {loading
                                                    ? "Starting..."
                                                    : "Start New Quiz"}
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={createQuiz}
                                                disabled={
                                                    loading || quizStarted
                                                }
                                            >
                                                {loading
                                                    ? "Starting..."
                                                    : quizStarted
                                                    ? "Quiz Started"
                                                    : "Start Quiz"}
                                            </Button>
                                        )}

                                        {quizStarted && !isQuizOver && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>
                                                        Quiz Question{" "}
                                                        {questionIndex + 1}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        Answer the following
                                                        question.
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    {generatingQuestion ? (
                                                        <p>
                                                            Generating
                                                            question...
                                                        </p>
                                                    ) : (
                                                        <p>{currentQuestion}</p>
                                                    )}
                                                    <input
                                                        type="text"
                                                        value={answer}
                                                        onChange={(e) =>
                                                            setAnswer(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border px-3 py-2 rounded"
                                                    />
                                                    <Button
                                                        onClick={
                                                            handleSubmitAnswer
                                                        }
                                                        disabled={
                                                            loadingGemini ||
                                                            !answer.trim()
                                                        }
                                                    >
                                                        {loadingGemini
                                                            ? "Submitting..."
                                                            : "Submit Answer"}
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {(isQuizOver || quizCompleted) &&
                                            !quizCompleted && (
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle>
                                                            Quiz Completed
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p>
                                                            Thank you for
                                                            completing the quiz!
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            )}
                                    </>
                                ) : (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Quiz Already Completed
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>
                                                You have already completed this
                                                quiz. Thank you!
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-blue-950 text-xl">
                                    Skill Map
                                </CardTitle>
                                <CardDescription>
                                    Visualization of your strengths
                                    <p className="text-sm text-muted-foreground">
                                        <Highlighter
                                            action="highlight"
                                            color="#87CEFA"
                                        >
                                            Upload your resume/LinkedIn to
                                            extract current skills.
                                        </Highlighter>
                                    </p>
                                </CardDescription>
                            </CardHeader>
                            <CardContent style={{ height: 280 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={data}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="subject" />
                                        <PolarRadiusAxis
                                            angle={30}
                                            domain={[0, 100]}
                                        />
                                        <Radar
                                            name="You"
                                            dataKey="A"
                                            stroke="#2563eb"
                                            fill="#2563eb"
                                            fillOpacity={0.25}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Tab: Paths */}
                <TabsContent value="paths" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            {
                                slug: "data-analyst",
                                title: "Data Analyst",
                            },
                            {
                                slug: "software-engineer",
                                title: "Software Engineer",
                            },
                            {
                                slug: "ux-designer",
                                title: "UX Designer",
                            },
                        ].map((p) => (
                            <Card key={p.slug}>
                                <CardHeader>
                                    <CardTitle>{p.title}</CardTitle>
                                    <CardDescription>
                                        Why they fit, skills match, salaries and
                                        trends
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mt-3 flex items-center gap-2">
                                        <Button
                                            asChild
                                            size="sm"
                                            className="text-xs"
                                        >
                                            <Link href={`/roadmap/${p.slug}`}>
                                                View Roadmap
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            <Link href="/skills">
                                                Compare Skills
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
