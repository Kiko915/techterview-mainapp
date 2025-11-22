
"use client";

import Link from "next/link";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, PlayCircle, ArrowLeft, Lock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProgressPercentage } from "../../../../../../utils";

export default function LessonSidebar({
    track,
    modules,
    currentModuleId,
    currentLessonId,
    enrollment,
    onNavigate,
    isCollapsed,
    className
}) {
    // Calculate progress
    const completedModulesCount = enrollment?.completedModules?.length || 0;
    const totalModules = modules.length;
    const trackProgress = getProgressPercentage(completedModulesCount, totalModules);

    return (
        <div className={cn("flex flex-col h-full bg-card", className)}>
            {/* Sidebar Header */}
            <div className={cn("border-b transition-all duration-300", isCollapsed ? "p-2" : "p-4 space-y-4")}>
                {!isCollapsed ? (
                    <>
                        <Link href={`/dashboard/interview-tracks/${track.id}`}>
                            <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>

                        <div>
                            <h2 className="font-semibold text-lg leading-tight mb-2">{track.title}</h2>
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{Math.round(trackProgress)}% Complete</span>
                                    <span>{completedModulesCount}/{totalModules} Modules</span>
                                </div>
                                <Progress value={trackProgress} className="h-2" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-4 py-2">
                        <Link href={`/dashboard/interview-tracks/${track.id}`}>
                            <Button variant="ghost" size="icon" title="Back to Dashboard">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${trackProgress}%` }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Modules List */}
            <div className="flex-1 overflow-y-auto min-h-0">
                <div className={cn("transition-all duration-300 pb-20", isCollapsed ? "p-2" : "p-4")}>
                    <Accordion type="single" collapsible defaultValue={currentModuleId} className="w-full space-y-4">
                        {modules.map((module, index) => {
                            const isModuleCompleted = enrollment?.completedModules?.includes(module.id);
                            const isCurrentModule = module.id === currentModuleId;

                            return (
                                <AccordionItem key={module.id} value={module.id} className="border rounded-lg px-0 overflow-hidden">
                                    <AccordionTrigger
                                        className={cn(
                                            "hover:no-underline py-3 group transition-all",
                                            isCollapsed ? "justify-center px-0" : "px-2"
                                        )}
                                    >
                                        <div className={cn("flex items-center gap-3 text-left w-full", isCollapsed && "justify-center")}>
                                            <div className={cn(
                                                "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium transition-colors shrink-0",
                                                isModuleCompleted
                                                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                                    : isCurrentModule
                                                        ? "bg-primary/10 text-primary"
                                                        : "bg-muted text-muted-foreground"
                                            )}>
                                                {isModuleCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                                            </div>
                                            {!isCollapsed && (
                                                <span className={cn(
                                                    "font-medium text-sm flex-1 break-words whitespace-normal",
                                                    isCurrentModule && "text-primary"
                                                )}>
                                                    {module.title}
                                                </span>
                                            )}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className={cn("pb-3", isCollapsed ? "px-1" : "px-2")}>
                                        <div className={cn("space-y-1 pt-1", !isCollapsed && "pl-7")}>
                                            {module.lessons?.map((lesson) => {
                                                const isActive = lesson.id === currentLessonId;
                                                const isCompleted = enrollment?.completedLessons?.includes(lesson.id);

                                                return (
                                                    <Link
                                                        key={lesson.id}
                                                        href={`/dashboard/interview-tracks/${track.id}/modules/${module.id}/lesson/${lesson.id}`}
                                                        onClick={onNavigate}
                                                        className={cn(
                                                            "flex items-center gap-3 p-2 rounded-md text-sm transition-all relative group/lesson",
                                                            isActive
                                                                ? "bg-primary/10 text-primary font-medium"
                                                                : "hover:bg-muted text-muted-foreground hover:text-foreground",
                                                            isCollapsed && "justify-center px-0"
                                                        )}
                                                        title={isCollapsed ? lesson.title : undefined}
                                                    >
                                                        {/* Status Indicator */}
                                                        <div className="shrink-0">
                                                            {isActive ? (
                                                                <PlayCircle className="h-4 w-4" />
                                                            ) : isCompleted ? (
                                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                            ) : (
                                                                <Circle className="h-4 w-4 opacity-40" />
                                                            )}
                                                        </div>

                                                        {!isCollapsed && (
                                                            <span className="break-words whitespace-normal leading-snug">{lesson.title}</span>
                                                        )}

                                                        {/* Active Indicator Bar */}
                                                        {isActive && (
                                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full -ml-2" />
                                                        )}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </div>
            </div>
        </div>
    );
}
