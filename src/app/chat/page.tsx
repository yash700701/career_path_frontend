"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Highlighter } from "@/components/ui/highlighter";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import axios from "axios";
import { toast } from "sonner";

type Message = {
    role: "user" | "bot";
    text: string;
};

type HistoryItem = {
    role: "user" | "model";
    parts: { text: string }[];
};

export default function CareerChatbot() {
    const token = useSelector((state: RootState) => state.auth.token);
    const port = process.env.NEXT_PUBLIC_API_PORT;
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "bot",
            text: "👋 Hi! I’m your Career Advisor. Ask me anything about your career recommendations, skills to learn, or roadmaps!",
        },
    ]);
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [userInfo, setUserInfo] = useState({});
    const [resumeInfo, setResumeInfo] = useState({});
    const [quizInfo, setQuizInfo] = useState({});
    const [generatingResponse, setGeneratingResponse] = useState(false);

    useEffect(() => {
        const getUserDetail = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                };

                const [resumeRes, profileRes, QuizRes] = await Promise.all([
                    axios.get(`${port}/api/upload/get-resume`, { headers }),
                    axios.get(`${port}/api/auth/profile`, { headers }),
                    axios.get(`${port}/api/quiz/return-quiz`, { headers }),
                ]);

                const resume = resumeRes.data.data;
                const user = profileRes.data.user;
                const quiz = QuizRes.data.questions;

                if (!resume || !user || !quiz) {
                    toast.info(
                        "Missing data: Fill onboarding form, upload resume and give quiz"
                    );
                    return;
                }

                console.log(resume);
                console.log(user);
                console.log(quiz);

                setUserInfo(user);
                setResumeInfo(resume);
                setQuizInfo(quiz);
            } catch (err) {
                console.error("Failed to get career recommendation:", err);
            }
        };
        getUserDetail();
    }, []);

    const handleSend = async () => {
        if (!userInfo || !resumeInfo || !quizInfo) {
            toast.info(
                "Missing data: Fill onboarding form, upload resume and give quiz"
            );
            return;
        }

        if (!input.trim()) return; // avoid empty send

        setGeneratingResponse(true);

        // Add user message immediately
        setMessages((prev) => [...prev, { role: "user", text: input }]);

        try {
            const response = await axios.post(
                `${port}/api/chat/chat-handler`,
                {
                    history: history,
                    userDetail: userInfo,
                    resumeDetail: resumeInfo,
                    quizDetail: quizInfo,
                    input: input,
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

            // Push bot response into chat
            setMessages((prev) => [...prev, { role: "bot", text: data.text }]);

            // Update history for next request
            setHistory((prev) => [
                ...prev,
                { role: "user", parts: [{ text: input }] },
                { role: "model", parts: [{ text: data.text }] },
            ]);

            // Clear input box
            setInput("");
        } catch (err) {
            console.error("Failed to generate question:", err);
            toast.error("Error generating question");
        } finally {
            setGeneratingResponse(false);
        }
    };

    return (
        <div className="flex mt-18 flex-col h-[80vh] px-2 md:px-10 lg:px-24">
            <Card className="flex-1 border-none px-0 shadow-none flex flex-col overflow-hidden">
                <CardHeader className="px-0">
                    <CardTitle>
                        <h1 className="text-4xl font-semibold text-blue-950">
                            {" "}
                            <Highlighter action="underline" color="#FF9800">
                                Career Advisor Chatbot
                            </Highlighter>
                        </h1>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 px-3 overflow-y-auto">
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${
                                msg.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`rounded-2xl my-2 px-4 py-2 max-w-[75%] shadow ${
                                    msg.role === "user"
                                        ? "bg-blue-950 text-white"
                                        : "bg-white border text-gray-800"
                                }`}
                            >
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}

                    {generatingResponse && (
                        <div className="text-sm text-gray-500">Typing...</div>
                    )}
                </CardContent>

                <div className="flex items-center gap-2 border-t p-2">
                    <Input
                        placeholder="Ask about your career path..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <Button onClick={handleSend} disabled={generatingResponse}>
                        Send
                    </Button>
                </div>
            </Card>
        </div>
    );
}
