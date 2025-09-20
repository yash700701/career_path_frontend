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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";
import { useSelector, useDispatch } from "react-redux";
import {
    setQuizCompleted,
    setRecommendationGenerated,
} from "../../store/authSlice";
import { RootState, AppDispatch } from "@/store/store";
import { Highlighter } from "@/components/ui/highlighter";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

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

export default function AssessmentPage() {
    const port = process.env.NEXT_PUBLIC_API_PORT;
    const router = useRouter();
    const token = useSelector((state: RootState) => state.auth.token);
    const quizCompleted = useSelector(
        (state: RootState) => state.auth.quizCompleted
    );
    const recommendationGenerated = useSelector(
        (state: RootState) => state.auth.recommendationGenerated
    );
    const [quizId, setQuizId] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const [quizStarted, setQuizStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingGemini, setLoadingGemini] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [generatingQuestion, setGeneratingQuestion] = useState(false);
    const [generatingRecommendation, setGeneratingRecommendation] =
        useState(false);
    const [generatedRecommendation, setGeneratedRecommendation] =
        useState(false);
    const [recommendations, setRecommendations] = useState<Career[]>([]);
    const [summary, setSummary] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [questionIndex, setQuestionIndex] = useState(0);
    const [isQuizOver, setIsQuizOver] = useState(false);

    const [userInfo, setUserInfo] = useState({});
    const [resumeInfo, setResumeInfo] = useState({});

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
                    setGeneratedRecommendation(true);
                    setRecommendations(
                        response.data.profile.recommendedCareers
                    );
                    setSummary(response.data.profile.summary);
                    dispatch(
                        setRecommendationGenerated({
                            recommendationGenerated: true,
                        })
                    );
                }
            } catch (err) {
                console.error("Failed to get career recommendation:", err);
            }
        };
        getRecommendations();
    }, []);

    useEffect(() => {
        const getUserDetail = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                };

                const [resumeRes, profileRes] = await Promise.all([
                    axios.get(`${port}/api/upload/get-resume`, { headers }),
                    axios.get(`${port}/api/auth/profile`, { headers }),
                ]);

                const resume = resumeRes.data.data;
                const user = profileRes.data.user;

                if (!resume || !user) {
                    toast.info(
                        "Missing data: Fill onboarding form and upload resume"
                    );
                    return;
                }

                console.log(resume);
                console.log(user);

                setUserInfo(user);
                setResumeInfo(resume);
            } catch (err) {
                console.error("Failed to get career recommendation:", err);
            }
        };
        getUserDetail();
    }, []);

    const generateCareerRecommendation = async () => {
        setGeneratingRecommendation(true);
        try {
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };

            // fetch all three in parallel
            const [quizRes, resumeRes, profileRes] = await Promise.all([
                axios.get(`${port}/api/quiz/return-quiz`, { headers }),
                axios.get(`${port}/api/upload/get-resume`, { headers }),
                axios.get(`${port}/api/auth/profile`, { headers }),
            ]);

            const questions = quizRes.data.questions; // keep as array/object
            const resume = resumeRes.data.data;
            const user = profileRes.data.user;

            // sanity check
            if (!questions || !resume || !user) {
                toast.info(
                    "Missing data: please ensure quiz, resume and profile exist."
                );
                return;
            }

            // send to backend
            const response = await axios.post(
                `${port}/api/career/generateRecommendation`,
                {
                    userProfile: user,
                    QuizAnswers: questions,
                    ResumeData: resume,
                },
                { headers }
            );

            if (response) {
                setGeneratedRecommendation(true);
                setRecommendations(response.data.profile.recommendedCareers);
                setSummary(response.data.profile.summary);
                dispatch(
                    setRecommendationGenerated({
                        recommendationGenerated: true,
                    })
                );
            }
            console.log(
                "generateCareerRecommendation result:",
                response.data.profile
            );
            toast.success("Recommendation generated!");
        } catch (err) {
            console.error("Failed to generate career recommendation:", err);
            toast.error("Error generating career recommendation");
        } finally {
            setGeneratingRecommendation(false);
        }
    };

    const nextQuestion = async () => {
        if (!userInfo || !resumeInfo) {
            toast.info("Missing data: Fill onboarding form and upload resume");
            return;
        }
        setGeneratingQuestion(true);
        try {
            const response = await axios.post(
                `${port}/api/quiz/quiz-handler`,
                {
                    history: history,
                    userDetail: userInfo,
                    resumeDetail: resumeInfo,
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
                toast.error("Model is overloaded - error generating");
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
            toast.error("Error generating question");
        } finally {
            setGeneratingQuestion(false);
        }
    };

    const createQuiz = async () => {
        if (!token) {
            router.push("/login");
        }
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
                nextQuestion();
            }
        } catch (error) {
            console.error("Failed to start quiz:", error);
            toast.error("Failed to start quiz.");
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
            console.error("Error saving records:", error);
            toast.error("Error saving records");
        } finally {
            setLoadingGemini(false);
        }
    };

    const handelGenerateNewQuiz = () => {
        createQuiz();
    }

    return (
        <div className="space-y-6 px-2 md:px-10 lg:px-24 mt-24 mb-10">
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
                <TabsList className="flex gap-2 w-full justify-center">
                    <TabsTrigger
                        value="skills"
                        className="text-center text-xs sm:text-md"
                    >
                        1: Skills & Interests
                    </TabsTrigger>

                    <TabsTrigger
                        value="paths"
                        className="text-center text-xs sm:text-md"
                    >
                        2: Career Recommendations
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
                                                    <CardTitle className="text-blue-950">
                                                        Quiz Question{" "}
                                                        {questionIndex + 1}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        <Highlighter
                                                            action="highlight"
                                                            color="#87CEFA"
                                                        >
                                                            Answer the following
                                                            10 question.
                                                        </Highlighter>
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    {generatingQuestion ? (
                                                        <div className="flex gap-2 text-green-600">
                                                            <Loader2 className="animate-spin size-4" />
                                                            <p>
                                                                Generating
                                                                question...
                                                            </p>
                                                        </div>
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
                                            <CardTitle className="text-blue-950">
                                                Quiz Already Completed
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>
                                                You have{" "}
                                                <Highlighter
                                                    action="highlight"
                                                    color="#87CEFA"
                                                >
                                                    already completed
                                                </Highlighter>{" "}
                                                this quiz. Thank you!
                                            </p>

                                            <Button
                                                onClick={
                                                    handelGenerateNewQuiz
                                                }
                                                variant="outline"
                                                className="mt-3 mr-3 text-xs sm:text-md"
                                                disabled={
                                                    generatingRecommendation
                                                }
                                            >
                                                Start new quiz
                                            </Button>
                                            <Button
                                                onClick={
                                                    generateCareerRecommendation
                                                }
                                                className="mt-3 text-xs sm:text-md"
                                                disabled={
                                                    generatingRecommendation
                                                }
                                            >
                                                Generate Career Recommendations
                                            </Button>
                                            {generatingRecommendation && (
                                                <div className="flex gap-3 mt-4">
                                                    <Loader2 className="animate-spin size-4" />
                                                    <p className="text-green-600">
                                                        Generating career
                                                        recommendations...
                                                    </p>
                                                </div>
                                            )}
                                            {!generatingRecommendation &&
                                                (generatedRecommendation ||
                                                    recommendationGenerated) && (
                                                    <p className="text-green-600 mt-4">
                                                        Recommendation Generated
                                                        :{" "}
                                                        <span className="text-blue-950">
                                                            {" "}
                                                            <Highlighter
                                                                action="underline"
                                                                color="#FF9800"
                                                            >
                                                                Go to step 2
                                                            </Highlighter>
                                                        </span>
                                                    </p>
                                                )}
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
                    <div className="space-y-6">
                        {/* Summary Section */}
                        {summary && (
                            <Card className="border-l-4 border-blue-950 shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-blue-950">
                                        <Highlighter
                                            action="underline"
                                            color="#FF9800"
                                        >
                                            Career Summary
                                        </Highlighter>
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        {summary}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        )}

                        {/* Career Recommendation Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {recommendations?.map((rec, idx) => (
                                <Card
                                    key={idx}
                                    className="shadow-md hover:shadow-lg transition rounded-2xl overflow-x-hidden"
                                >
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            {rec.title}
                                            <Badge variant="secondary">
                                                {rec.matchScore}% Match
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription>
                                            {rec.industry}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-3">
                                        <p className="text-sm text-gray-700">
                                            <strong>Why Recommended:</strong>{" "}
                                            {rec.whyRecommended}
                                        </p>

                                        <p className="text-sm">
                                            <strong>Average Package:</strong>{" "}
                                            {rec.averagePackage}
                                        </p>

                                        <p className="text-sm">
                                            <strong>Future Scope:</strong>{" "}
                                            {rec.futureScope}
                                        </p>

                                        {/* Required Skills */}
                                        {rec.requiredSkills?.length > 0 && (
                                            <div>
                                                <p className="font-semibold">
                                                    Required Skills:
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {rec.requiredSkills.map(
                                                        (skill, i) => (
                                                            <Badge
                                                                key={i}
                                                                variant="outline"
                                                            >
                                                                {skill}
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Learning Resources */}
                                        {rec.learningResources?.length > 0 && (
                                            <div>
                                                <p className="font-semibold">
                                                    Learning Resources:
                                                </p>
                                                <ul className="list-disc list-inside text-sm">
                                                    {rec.learningResources.map(
                                                        (res, i) => (
                                                            <li key={i}>
                                                                <a
                                                                    href={
                                                                        res.link
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:underline"
                                                                >
                                                                    {res.name} (
                                                                    {res.type})
                                                                </a>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
