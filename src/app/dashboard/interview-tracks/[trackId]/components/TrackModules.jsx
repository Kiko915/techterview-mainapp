"use client";

import { Card, CardContent } from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { CheckCircle, PlayCircle } from "lucide-react";

export default function TrackModules({ modules, enrollment }) {
  if (!modules || modules.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Course Modules</h2>
          <div className="text-gray-600 dark:text-gray-400 text-center py-8">
            No modules available yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Course Modules</h2>
        
        <Accordion type="single" collapsible className="w-full">
          {modules.map((module, index) => (
            <AccordionItem key={module.id} value={module.id}>
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    enrollment?.completedModules?.includes(module.id)
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                      : enrollment?.currentModule === module.id
                      ? 'bg-[#354fd2] text-white'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {enrollment?.completedModules?.includes(module.id) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{module.title}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="ml-11 space-y-3">
                  {module.description && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-[#354fd2]">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {module.description}
                      </p>
                    </div>
                  )}
                  {module.lessons && module.lessons.length > 0 ? (
                    module.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <PlayCircle className="h-4 w-4 text-[#354fd2]" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{lesson.title}</div>
                          {lesson.duration && (
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {lesson.duration}
                            </div>
                          )}
                        </div>
                        {lesson.isCompleted && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-600 dark:text-gray-400 text-sm italic">
                      Lessons will be available soon
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}