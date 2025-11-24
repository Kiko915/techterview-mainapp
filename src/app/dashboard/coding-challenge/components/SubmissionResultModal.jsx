"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RotateCcw, Wrench, ArrowLeft, Sparkles } from "lucide-react";

export default function SubmissionResultModal({
    isOpen,
    onClose,
    status, // 'success' | 'error'
    feedback,
    onRetry // Function to handle "Retry Submission"
}) {
    const router = useRouter();

    const isSuccess = status === "success";

    // Image paths provided by user
    const successImage = "/assets/techbot/tbot-success.png";
    const errorImage = "/assets/techbot/tbot-error.png";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[750px] p-0 gap-0 overflow-hidden bg-background border-none shadow-2xl">
                <div className="flex flex-col-reverse sm:flex-row h-full">
                    {/* Left Side: Content */}
                    <div className="flex-1 p-8 flex flex-col justify-center">
                        <DialogHeader className="sm:text-left mb-6">
                            <DialogTitle className={`text-3xl font-bold font-playfair mb-3 ${isSuccess ? "text-blue-600" : "text-red-600"}`}>
                                {isSuccess ? "Excellent Work!" : "Needs Improvement"}
                            </DialogTitle>
                            <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                                {isSuccess
                                    ? "You've successfully completed this challenge. TechBot is proud of your progress!"
                                    : "Don't worry, debugging is part of the process. Review the feedback and try again."}
                            </DialogDescription>
                        </DialogHeader>

                        {/* Feedback Box */}
                        <div className={`mb-8 p-4 rounded-lg text-sm border ${isSuccess
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : "bg-red-50 text-red-700 border-red-100"
                            }`}>
                            <p className="font-semibold mb-1 flex items-center gap-2">
                                {isSuccess && <Sparkles className="h-4 w-4 text-blue-500" />}
                                {isSuccess ? "AI Feedback:" : "Error Details:"}
                            </p>
                            <p className="opacity-90">
                                {feedback || (isSuccess ? "All test cases passed successfully." : "Code execution failed. Please check your syntax and logic.")}
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3">
                            {isSuccess ? (
                                <Button
                                    onClick={() => router.push("/dashboard/coding-challenge")}
                                    className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 shadow-md transition-all hover:scale-[1.02]"
                                >
                                    <ArrowLeft className="mr-2 h-5 w-5" />
                                    Back to Lobby
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        onClick={onRetry}
                                        variant="destructive"
                                        className="w-full h-12 text-base shadow-md transition-all hover:scale-[1.02]"
                                    >
                                        <RotateCcw className="mr-2 h-5 w-5" />
                                        Retry Submission
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={onClose}
                                        className="w-full h-12 text-base bg-slate-100 hover:bg-slate-200 text-slate-700"
                                    >
                                        <Wrench className="mr-2 h-5 w-5" />
                                        Fix Code
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Image */}
                    <div className={`flex-1 flex items-center justify-center p-8 relative overflow-hidden ${isSuccess ? "bg-blue-50/50" : "bg-red-50/50"
                        }`}>
                        {/* Decorative Blob Background */}
                        <div className={`absolute inset-0 opacity-20 ${isSuccess ? "bg-blue-200" : "bg-red-200"
                            }`} style={{
                                clipPath: "circle(70% at 80% 20%)"
                            }} />

                        <div className="relative w-64 h-64 sm:w-72 sm:h-72 drop-shadow-xl transform transition-transform duration-700 hover:scale-105">
                            <Image
                                src={isSuccess ? successImage : errorImage}
                                alt={isSuccess ? "Success TechBot" : "Error TechBot"}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
