
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getUserEnrollment, getUserCompletedChallenges } from "@/lib/firestore";
import ChallengeList from "./components/ChallengeList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkles, Code2, Server } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CodingChallengeLobby() {
    const { user } = useAuth();
    const [challenges, setChallenges] = useState([]);
    const [enrolledTracks, setEnrolledTracks] = useState([]);
    const [completedIds, setCompletedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("frontend");
    const [difficultyFilter, setDifficultyFilter] = useState("all");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 1. Fetch all challenges
                const challengesSnapshot = await getDocs(collection(db, "challenges"));
                const challengesData = challengesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setChallenges(challengesData);

                // 2. Fetch user enrollments and completed challenges if logged in
                if (user) {
                    // Fetch completed challenges
                    const completed = await getUserCompletedChallenges(user.uid);
                    setCompletedIds(completed);

                    // This is a bit tricky since enrollments are subcollections or separate docs.
                    // Assuming we can get a list of trackIds the user is enrolled in.
                    // For now, let's just fetch all enrollments we can find or assume a structure.
                    // Since getUserEnrollment requires trackId, we might need to fetch all tracks first or query the enrollments collection group.
                    // SIMPLIFICATION: We'll just check if they have "track-frontend" or "track-backend" in their recent activity or just fetch all.

                    // Actually, let's just fetch the specific track enrollments we care about for recommendations
                    const frontendEnrollment = await getUserEnrollment(user.uid, "track-frontend");
                    const backendEnrollment = await getUserEnrollment(user.uid, "track-backend");

                    const tracks = [];
                    if (frontendEnrollment) tracks.push("frontend");
                    if (backendEnrollment) tracks.push("backend");
                    setEnrolledTracks(tracks);

                    // Set active tab based on enrollment preference (default to frontend if both or neither)
                    if (tracks.includes("backend") && !tracks.includes("frontend")) {
                        setActiveTab("backend");
                    }
                }

            } catch (error) {
                console.error("Error fetching lobby data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Filter logic
    const filterChallenges = (category) => {
        return challenges.filter(c => {
            const matchesCategory = c.category === category || c.category === "universal";
            const matchesDifficulty = difficultyFilter === "all" || c.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
            return matchesCategory && matchesDifficulty;
        });
    };

    const frontendChallenges = filterChallenges("frontend");
    const backendChallenges = filterChallenges("backend");

    // Recommendation logic
    const recommendedChallenges = challenges.filter(c => {
        if (enrolledTracks.includes(c.category)) return true;
        if (c.category === "universal" && enrolledTracks.length > 0) return true;
        return false;
    }).slice(0, 3); // Top 3 recommendations

    // Seeding logic (Temporary fix for missing data)
    const handleSeed = async () => {
        try {
            setLoading(true);
            const { doc, setDoc } = await import("firebase/firestore");

            const challengesToSeed = [
                {
                    id: "js-counter-closure",
                    title: "Counter Closure",
                    description: "# Counter Closure\n\nImplement a function `createCounter` that accepts an integer `n`.\nIt should return another function that, when called, returns `n` initially, and then `n + 1`, `n + 2`, etc.\n\n## Example 1:\n```\nconst counter = createCounter(10);\ncounter(); // 10\ncounter(); // 11\ncounter(); // 12\n```",
                    category: "frontend",
                    difficulty: "Easy",
                    languageRestriction: ["javascript"],
                    starterCode: {
                        javascript: "/**\n * @param {number} n\n * @return {Function} counter\n */\nvar createCounter = function(n) {\n    \n};"
                    },
                    testHarness: {
                        javascript: "\nconst assert = require('assert');\ntry {\n    const counter = createCounter(10);\n    assert.strictEqual(counter(), 10, \"First call should return 10\");\n    assert.strictEqual(counter(), 11, \"Second call should return 11\");\n    assert.strictEqual(counter(), 12, \"Third call should return 12\");\n    console.log(\"All tests passed!\");\n} catch (e) {\n    console.error(e.message);\n    process.exit(1);\n}\n"
                    }
                },
                {
                    id: "py-valid-anagram",
                    title: "Valid Anagram",
                    description: "# Valid Anagram\n\nGiven two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.\n\n## Example 1:\n```\nInput: s = \"anagram\", t = \"nagaram\"\nOutput: true\n```",
                    category: "backend",
                    difficulty: "Easy",
                    languageRestriction: ["python"],
                    starterCode: {
                        python: "def isAnagram(s: str, t: str) -> bool:\n    pass"
                    },
                    testHarness: {
                        python: "\nimport sys\n\ntry:\n    assert isAnagram(\"anagram\", \"nagaram\") == True, \"Test Case 1 Failed\"\n    assert isAnagram(\"rat\", \"car\") == False, \"Test Case 2 Failed\"\n    print(\"All tests passed!\")\nexcept AssertionError as e:\n    print(e)\n    sys.exit(1)\nexcept Exception as e:\n    print(f\"Error: {e}\")\n    sys.exit(1)\n"
                    }
                },
                {
                    id: "universal-two-sum",
                    title: "Two Sum",
                    description: "# Two Sum\n\nGiven an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.\n\n## Example 1:\n```\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n```",
                    category: "universal",
                    difficulty: "Easy",
                    languageRestriction: ["javascript", "python"],
                    starterCode: {
                        javascript: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};",
                        python: "def twoSum(nums: List[int], target: int) -> List[int]:\n    pass"
                    },
                    testHarness: {
                        javascript: "\nconst assert = require('assert');\ntry {\n    const result1 = twoSum([2,7,11,15], 9);\n    assert.deepStrictEqual(result1.sort(), [0,1], \"Test Case 1 Failed\");\n    \n    const result2 = twoSum([3,2,4], 6);\n    assert.deepStrictEqual(result2.sort(), [1,2], \"Test Case 2 Failed\");\n    \n    console.log(\"All tests passed!\");\n} catch (e) {\n    console.error(e.message);\n    process.exit(1);\n}\n",
                        python: "\nimport sys\nfrom typing import List\n\ntry:\n    assert sorted(twoSum([2,7,11,15], 9)) == [0,1], \"Test Case 1 Failed\"\n    assert sorted(twoSum([3,2,4], 6)) == [1,2], \"Test Case 2 Failed\"\n    print(\"All tests passed!\")\nexcept AssertionError as e:\n    print(e)\n    sys.exit(1)\nexcept Exception as e:\n    print(f\"Error: {e}\")\n    sys.exit(1)\n"
                    }
                }
            ];

            for (const challenge of challengesToSeed) {
                await setDoc(doc(db, "challenges", challenge.id), challenge);
            }

            // Refresh list
            const challengesSnapshot = await getDocs(collection(db, "challenges"));
            const challengesData = challengesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setChallenges(challengesData);

        } catch (error) {
            console.error("Error seeding challenges:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading challenges...</div>;
    }

    return (
        <div className="container space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-playfair">Coding Challenges</h1>
                <p className="text-muted-foreground mt-2">
                    Practice your skills with role-aligned coding problems.
                </p>
            </div>

            {challenges.length === 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-lg text-center space-y-4">
                    <h3 className="text-lg font-semibold text-yellow-600">No Challenges Found</h3>
                    <p className="text-sm text-muted-foreground">The database appears to be empty. Click below to load sample challenges.</p>
                    <button
                        onClick={handleSeed}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Load Sample Challenges
                    </button>
                </div>
            )}

            {/* Recommended Section */}
            {enrolledTracks.length > 0 && recommendedChallenges.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                        <Sparkles className="h-5 w-5" />
                        <h2 className="text-xl font-semibold">Recommended for You</h2>
                    </div>
                    <ChallengeList challenges={recommendedChallenges} completedIds={completedIds} />
                </section>
            )}

            {/* Main List with Role Toggle */}
            <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold">Explore Challenges</h2>

                    {/* Difficulty Filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Difficulty:</span>
                        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8 bg-muted/50 p-1 rounded-lg">
                        <TabsTrigger
                            value="frontend"
                            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                        >
                            <Code2 className="h-4 w-4" />
                            Frontend Prep
                        </TabsTrigger>
                        <TabsTrigger
                            value="backend"
                            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                        >
                            <Server className="h-4 w-4" />
                            Backend Prep
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="frontend" className="space-y-4">
                        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg text-sm text-blue-500 mb-4">
                            <strong>Focus:</strong> JavaScript internals, DOM manipulation, Closures, and Async patterns.
                        </div>
                        <ChallengeList challenges={frontendChallenges} completedIds={completedIds} />
                    </TabsContent>

                    <TabsContent value="backend" className="space-y-4">
                        <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg text-sm text-orange-500 mb-4">
                            <strong>Focus:</strong> Algorithms, Data Structures, Python efficiency, and System logic.
                        </div>
                        <ChallengeList challenges={backendChallenges} completedIds={completedIds} />
                    </TabsContent>
                </Tabs>
            </section>
        </div>
    );
}
