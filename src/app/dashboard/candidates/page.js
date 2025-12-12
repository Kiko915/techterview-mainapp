"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, User, Mail, Award, Filter } from "lucide-react";
import { getUsersByRole } from "@/lib/firestore_modules/users";
import { getUserCertificates } from "@/lib/firestore_modules/certificates";

export default function CandidatesPage() {
    const router = useRouter();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCandidates, setFilteredCandidates] = useState([]);

    // Filters
    const [filterSkill, setFilterSkill] = useState("all");
    const [filterExperience, setFilterExperience] = useState("all");
    const [filterCertified, setFilterCertified] = useState(false);

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setLoading(true);
                const users = await getUsersByRole('candidate');

                // Fetch certificates for each candidate
                const candidatesWithCerts = await Promise.all(users.map(async (user) => {
                    const certs = await getUserCertificates(user.uid);
                    return { ...user, certificates: certs };
                }));

                setCandidates(candidatesWithCerts);
                setFilteredCandidates(candidatesWithCerts);
            } catch (error) {
                console.error("Error fetching candidates:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    useEffect(() => {
        const results = candidates.filter(candidate => {
            const name = (candidate.displayName || candidate.username || "").toLowerCase();
            const skill = (candidate.skill || "").toLowerCase();
            const search = debouncedSearch.toLowerCase();
            const matchesSearch = name.includes(search) || skill.includes(search);

            const matchesSkill = filterSkill === "all" || (candidate.skill && candidate.skill.toLowerCase().includes(filterSkill.toLowerCase()));
            const matchesExperience = filterExperience === "all" || (candidate.experienceLevel && candidate.experienceLevel.toLowerCase() === filterExperience.toLowerCase());
            const matchesCertified = !filterCertified || (candidate.certificates && candidate.certificates.length > 0);

            return matchesSearch && matchesSkill && matchesExperience && matchesCertified;
        });
        setFilteredCandidates(results);
    }, [debouncedSearch, candidates, filterSkill, filterExperience, filterCertified]);

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col gap-4 flex-shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight font-playfair text-gray-900">Candidates</h1>
                        <p className="text-muted-foreground">
                            Find and connect with top tech talent.
                        </p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Search by name or skill..."
                            className="pl-9 bg-white border-gray-200 focus-visible:ring-[#354fd2]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mr-2">
                        <Filter className="h-4 w-4" />
                        Filters:
                    </div>

                    <Select value={filterSkill} onValueChange={setFilterSkill}>
                        <SelectTrigger className="w-[140px] h-9 border-gray-200">
                            <SelectValue placeholder="Skill" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Skills</SelectItem>
                            <SelectItem value="frontend">Frontend</SelectItem>
                            <SelectItem value="backend">Backend</SelectItem>
                            <SelectItem value="ui/ux">UI/UX</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filterExperience} onValueChange={setFilterExperience}>
                        <SelectTrigger className="w-[140px] h-9 border-gray-200">
                            <SelectValue placeholder="Experience" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Experience</SelectItem>
                            <SelectItem value="entry">Entry Level</SelectItem>
                            <SelectItem value="mid">Mid Level</SelectItem>
                            <SelectItem value="senior">Senior Level</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex items-center space-x-2 ml-auto">
                        <Switch
                            id="certified-mode"
                            checked={filterCertified}
                            onCheckedChange={setFilterCertified}
                            className="data-[state=checked]:bg-amber-500"
                        />
                        <Label htmlFor="certified-mode" className="text-sm font-medium cursor-pointer text-gray-700">
                            Certified Only
                        </Label>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="animate-pulse border-gray-100 shadow-none">
                            <CardContent className="p-6 h-48 bg-gray-50/50"></CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredCandidates.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                        <User className="h-8 w-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No candidates found</h3>
                    <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                        We couldn't find any candidates matching your criteria. Try adjusting your filters or search terms.
                    </p>
                </div>
            ) : (
                <div className="relative flex-1 min-h-0">
                    <div className="absolute inset-0 overflow-y-auto pr-2 pb-4 hover:pr-2 [scrollbar-gutter:stable]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 pb-8">
                            {filteredCandidates.map((candidate) => {
                                const isCertified = candidate.certificates && candidate.certificates.length > 0;
                                return (
                                    <Card
                                        key={candidate.id}
                                        className={`group relative overflow-hidden transition-all duration-300 border
                                        ${isCertified
                                                ? 'bg-white border-amber-200/60 shadow-[0_4px_20px_-8px_rgba(251,191,36,0.25)] hover:shadow-[0_8px_30px_-12px_rgba(251,191,36,0.4)] hover:border-amber-300'
                                                : 'bg-white border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200'
                                            }`}
                                    >
                                        {/* Certified Badge Ribbon */}
                                        {isCertified && (
                                            <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[10px] font-bold py-1 w-[150px] text-center shadow-md z-10 selection:bg-transparent">
                                                CERTIFIED
                                            </div>
                                        )}

                                        <CardContent className="p-0">
                                            {/* Header Background */}
                                            <div className={`h-24 w-full ${isCertified ? 'bg-gradient-to-r from-amber-50 to-yellow-50/50' : 'bg-gradient-to-r from-gray-50 to-white'}`}></div>

                                            <div className="px-6 pb-6 -mt-12 flex flex-col items-center">
                                                {/* Avatar */}
                                                <div className={`relative h-24 w-24 rounded-full p-1 bg-white mb-4 transition-transform duration-300 group-hover:scale-105
                                                ${isCertified
                                                        ? 'ring-2 ring-amber-100 shadow-lg'
                                                        : 'ring-1 ring-gray-100 shadow-md'
                                                    }`}>
                                                    <div className="relative h-full w-full rounded-full overflow-hidden">
                                                        {candidate.photoURL ? (
                                                            <Image
                                                                src={candidate.photoURL}
                                                                alt={candidate.displayName || "Candidate"}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className={`h-full w-full flex items-center justify-center text-white text-3xl font-bold
                                                            ${isCertified
                                                                    ? 'bg-gradient-to-br from-amber-400 to-yellow-500'
                                                                    : 'bg-gradient-to-br from-[#354fd2] to-[#607dff]'
                                                                }`}>
                                                                {(candidate.displayName || candidate.username || "U").charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Certified Icon Badge */}
                                                    {isCertified && (
                                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md border border-amber-100" title={`${candidate.certificates.length} Certificates`}>
                                                            <Award className="h-5 w-5 text-amber-500 fill-amber-500" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Name & Title */}
                                                <div className="text-center mb-4 w-full">
                                                    <h3 className="font-playfair font-bold text-xl text-gray-900 mb-1 truncate px-2">
                                                        {candidate.displayName || candidate.username || "Unnamed Candidate"}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium text-[11px]">
                                                        {candidate.skill || "Developer"}
                                                    </p>
                                                </div>

                                                {/* Skill Pills */}
                                                <div className="flex flex-wrap justify-center gap-2 mb-6 w-full">
                                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-0 font-normal px-3 py-1">
                                                        {candidate.skill || "General"}
                                                    </Badge>
                                                    {candidate.experienceLevel && (
                                                        <Badge variant="outline" className={`font-normal px-3 py-1 ${candidate.experienceLevel === 'Senior' ? 'border-purple-200 text-purple-700 bg-purple-50' :
                                                            candidate.experienceLevel === 'Mid' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                                                                'border-green-200 text-green-700 bg-green-50'
                                                            }`}>
                                                            {candidate.experienceLevel}
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Action Button */}
                                                <Button
                                                    onClick={() => router.push(`/dashboard/candidates/${candidate.uid}`)}
                                                    className={`w-full font-medium transition-all duration-300 rounded-lg h-10 shadow-sm
                                                    ${isCertified
                                                            ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:shadow-amber-200 hover:shadow-lg border-0'
                                                            : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                    size="sm"
                                                >
                                                    View Profile
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
