"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getQuestionsByQuizId, saveQuizResult } from "@/lib/firestore";
import { useAuth } from "@/lib/useAuth";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";

export default function QuizComponent({ quizId, onComplete, isCompleted }) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(isCompleted);
    const [score, setScore] = useState(isCompleted ? 100 : 0);
    const [passed, setPassed] = useState(isCompleted);

    // Retry Logic
    const [retryAvailableAt, setRetryAvailableAt] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(0);

    useEffect(() => {
        if (isCompleted) {
            setLoading(false);
            setShowResult(true);
            setPassed(true);
            setScore(100);
            return;
        }
        fetchQuestions();

        // Check for existing cooldown in localStorage
        const storedRetryTime = localStorage.getItem(`quiz_retry_${quizId}`);
        if (storedRetryTime) {
            const retryTime = parseInt(storedRetryTime);
            if (retryTime > Date.now()) {
                setRetryAvailableAt(retryTime);
                setShowResult(true);
                setPassed(false);

                // Restore score
                const storedScore = localStorage.getItem(`quiz_score_${quizId}`);
                if (storedScore) {
                    setScore(parseFloat(storedScore));
                }
            } else {
                localStorage.removeItem(`quiz_retry_${quizId}`);
                localStorage.removeItem(`quiz_score_${quizId}`);
            }
        }
    }, [quizId, isCompleted]);

    useEffect(() => {
        let timer;
        if (retryAvailableAt) {
            timer = setInterval(() => {
                const now = Date.now();
                const remaining = Math.max(0, Math.ceil((retryAvailableAt - now) / 1000));
                setTimeRemaining(remaining);

                if (remaining <= 0) {
                    setRetryAvailableAt(null);
                    localStorage.removeItem(`quiz_retry_${quizId}`);
                    localStorage.removeItem(`quiz_score_${quizId}`);
                    clearInterval(timer);
                }
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [retryAvailableAt, quizId]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const fetchedQuestions = await getQuestionsByQuizId(quizId);

            // Randomize options and update correct answer index
            const processedQuestions = fetchedQuestions.map(q => {
                // Create array of objects with original value and index
                const optionsWithIndices = q.options.map((opt, i) => ({ opt, originalIndex: i }));

                // Shuffle the array
                for (let i = optionsWithIndices.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [optionsWithIndices[i], optionsWithIndices[j]] = [optionsWithIndices[j], optionsWithIndices[i]];
                }

                // Extract shuffled options
                const shuffledOptions = optionsWithIndices.map(item => item.opt);

                // Find the new index of the correct answer
                // The original correct answer index is q.correctAnswer
                // We need to find where that original index moved to in the shuffled array
                const newCorrectAnswer = optionsWithIndices.findIndex(item => item.originalIndex === q.correctAnswer);

                return {
                    ...q,
                    options: shuffledOptions,
                    correctAnswer: newCorrectAnswer
                };
            });

            setQuestions(processedQuestions);
        } catch (error) {
            console.error("Error fetching quiz questions:", error);
            toast.error("Failed to load quiz questions.");
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId, optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const handleSubmit = () => {
        let correctCount = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                correctCount++;
            }
        });

        const calculatedScore = (correctCount / questions.length) * 100;
        setScore(calculatedScore);

        const isPassed = calculatedScore >= 70; // 70% passing score
        setPassed(isPassed);
        setShowResult(true);

        // Save result to Firestore
        if (user) {
            saveQuizResult(user.uid, quizId, calculatedScore, isPassed, answers);
        }

        if (isPassed) {
            toast.success("Congratulations! You passed the quiz.");
            onComplete();
        } else {
            toast.error("You didn't pass. Please try again in 1 minute.");
            const retryTime = Date.now() + 60000;
            setRetryAvailableAt(retryTime);
            localStorage.setItem(`quiz_retry_${quizId}`, retryTime.toString());
            localStorage.setItem(`quiz_score_${quizId}`, calculatedScore.toString());
        }
    };

    const handleRetry = () => {
        if (timeRemaining > 0) return;

        setAnswers({});
        setCurrentQuestionIndex(0);
        setShowResult(false);
        setScore(0);
        setPassed(false);
        localStorage.removeItem(`quiz_retry_${quizId}`);
        localStorage.removeItem(`quiz_score_${quizId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No questions found for this quiz.
            </div>
        );
    }

    if (showResult) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Quiz Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col items-center justify-center space-y-2">
                        {passed ? (
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        ) : (
                            <XCircle className="h-16 w-16 text-red-500" />
                        )}
                        <div className="text-4xl font-bold">{Math.round(score)}%</div>
                        <p className="text-muted-foreground">
                            {passed ? "You have successfully passed this module!" : "You need 70% to pass."}
                        </p>
                    </div>

                    {!passed && (
                        <div className="bg-muted p-4 rounded-lg text-center">
                            {timeRemaining > 0 ? (
                                <p className="text-sm font-medium">
                                    Retry available in: <span className="text-primary">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
                                </p>
                            ) : (
                                <p className="text-sm text-green-600 font-medium">You can retry now!</p>
                            )}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="justify-center">
                    {!passed && (
                        <Button
                            onClick={handleRetry}
                            disabled={timeRemaining > 0}
                            className="gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Retry Quiz
                        </Button>
                    )}
                </CardFooter>
            </Card>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const allAnswered = questions.every(q => answers[q.id] !== undefined);

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className="text-sm font-medium text-primary">
                        {Object.keys(answers).length} answered
                    </span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
                <CardTitle className="text-xl mt-4">{currentQuestion.text}</CardTitle>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    key={currentQuestion.id}
                    value={answers[currentQuestion.id]?.toString() ?? ""}
                    onValueChange={(val) => handleOptionSelect(currentQuestion.id, parseInt(val))}
                    className="space-y-3"
                >
                    {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                            <RadioGroupItem value={index.toString()} id={`q-${currentQuestion.id}-option-${index}`} />
                            <Label htmlFor={`q-${currentQuestion.id}-option-${index}`} className="flex-1 cursor-pointer font-normal">
                                {option}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                >
                    Previous
                </Button>

                {isLastQuestion ? (
                    <Button
                        onClick={handleSubmit}
                        disabled={!allAnswered}
                        className="bg-[#354fd2] hover:bg-[#2a3fca]"
                    >
                        Submit Quiz
                    </Button>
                ) : (
                    <Button
                        onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    >
                        Next
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
