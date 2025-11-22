"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import LessonSidebar from "./LessonSidebar";
import { cn } from "@/lib/utils";

export default function LessonLayout({
    children,
    track,
    modules,
    currentModuleId,
    currentLessonId,
    enrollment
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Desktop Sidebar */}
            <div
                className={cn(
                    "hidden md:block shrink-0 h-full border-r transition-all duration-300 ease-in-out relative",
                    isCollapsed ? "w-[80px]" : "w-80"
                )}
            >
                <LessonSidebar
                    track={track}
                    modules={modules}
                    currentModuleId={currentModuleId}
                    currentLessonId={currentLessonId}
                    enrollment={enrollment}
                    isCollapsed={isCollapsed}
                />

                {/* Collapse Toggle Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-4 top-6 h-8 w-8 rounded-full border bg-background shadow-md z-10 hover:bg-accent hidden md:flex"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b bg-background">
                    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-80">
                            <LessonSidebar
                                track={track}
                                modules={modules}
                                currentModuleId={currentModuleId}
                                currentLessonId={currentLessonId}
                                enrollment={enrollment}
                                onNavigate={() => setIsSidebarOpen(false)}
                                isCollapsed={false}
                            />
                        </SheetContent>
                    </Sheet>
                    <span className="font-semibold truncate">
                        {modules.find(m => m.id === currentModuleId)?.lessons.find(l => l.id === currentLessonId)?.title}
                    </span>
                    <div className="w-9" /> {/* Spacer for balance */}
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
