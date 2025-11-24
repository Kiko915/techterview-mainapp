import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
    return (
        <div>
            {/* Greeting Card Skeleton */}
            <div className="p-6">
                <Card className="border-0 shadow-lg rounded-2xl overflow-hidden relative h-[300px]">
                    <CardContent className="p-8">
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-4 w-96" />
                            <div className="flex items-center gap-4 mt-4">
                                <Skeleton className="h-10 w-32 rounded-lg" />
                                <Skeleton className="h-10 w-32 rounded-lg" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="p-6 border-0 shadow-sm">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="px-6 pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Actions Skeleton */}
                    <Card className="bg-white border-0 shadow-sm">
                        <CardHeader className="pb-4">
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full rounded-md" />
                            ))}
                        </CardContent>
                    </Card>

                    {/* Recent Activity Skeleton */}
                    <Card className="bg-white border-0 shadow-sm">
                        <CardHeader className="pb-4">
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Upcoming Skeleton */}
                    <Card className="bg-white border-0 shadow-sm">
                        <CardHeader className="pb-4">
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
