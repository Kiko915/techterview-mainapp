"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowLeft, Mail, Award, MapPin, Calendar, ExternalLink, Briefcase,
    Eye, CheckCircle, User, Zap, Trophy, Code, Video
} from "lucide-react";
import { getUserByUID } from "@/lib/firestore_modules/users";
import { getUserCertificates } from "@/lib/firestore_modules/certificates";
import { getUserStats } from "@/lib/firestore_modules/stats";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function CandidateProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [candidate, setCandidate] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchCandidateData = async () => {
            if (!params.candidateId) return;

            try {
                setLoading(true);
                // Fetch user data
                const userData = await getUserByUID(params.candidateId);

                if (userData) {
                    setCandidate(userData);
                    // Fetch certificates
                    const certs = await getUserCertificates(params.candidateId);
                    setCertificates(certs);

                    // Fetch platform stats
                    const userStats = await getUserStats(params.candidateId);
                    setStats(userStats);
                }
            } catch (error) {
                console.error("Error fetching candidate profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidateData();
    }, [params.candidateId]);

    const handleViewCertificate = (cert) => {
        setSelectedCertificate(cert);
        setIsModalOpen(true);
    };

    const handleVerifyCertificate = (certId) => {
        if (certId && typeof window !== 'undefined') {
            const url = `${window.location.origin}/verify/${certId}`;
            window.open(url, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground">Loading candidate profile...</p>
            </div>
        );
    }

    if (!candidate) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Candidate Not Found</h2>
                <p className="text-muted-foreground mb-6">The candidate you are looking for does not exist or has been removed.</p>
                <Button onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Candidates
                </Button>
            </div>
        );
    }

    const isCertified = certificates.length > 0;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
            {/* Back Button */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-gray-500 hover:text-gray-900">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Candidates
                </Button>
            </div>

            {/* Header Profile Card */}
            <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                {/* Banner Background */}
                <div className={`h-32 w-full ${isCertified ? 'bg-gradient-to-r from-amber-50 to-yellow-100/50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}></div>

                <div className="px-8 pb-8">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar - Overlapping Banner */}
                        <div className="relative -mt-12 flex-shrink-0">
                            <div className={`relative h-32 w-32 rounded-full p-1 bg-white
                                ${isCertified
                                    ? 'ring-4 ring-amber-100 shadow-xl'
                                    : 'ring-4 ring-white shadow-lg'
                                }`}>
                                <div className="relative h-full w-full rounded-full overflow-hidden bg-gray-100">
                                    {candidate.photoURL ? (
                                        <Image
                                            src={candidate.photoURL}
                                            alt={candidate.displayName || "Candidate"}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className={`h-full w-full flex items-center justify-center text-white text-4xl font-bold
                                            ${isCertified
                                                ? 'bg-gradient-to-br from-amber-400 to-yellow-500'
                                                : 'bg-gradient-to-br from-[#354fd2] to-[#607dff]'
                                            }`}>
                                            {(candidate.displayName || candidate.username || "U").charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                {isCertified && (
                                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border border-amber-100" title="Certified Candidate">
                                        <Award className="h-6 w-6 text-amber-500 fill-amber-500" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="pt-4 flex-1">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h1 className="text-3xl font-playfair font-bold text-gray-900">
                                            {candidate.displayName || candidate.username || "Candidate Profile"}
                                        </h1>
                                        {isCertified && (
                                            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 border-0 hover:from-amber-600 hover:to-yellow-700">
                                                Certified Talent
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-lg text-muted-foreground font-medium mb-4">
                                        {candidate.skill || "Software Developer"} • {candidate.experienceLevel || "Entry Level"}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        {candidate.location && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4" />
                                                {candidate.location}
                                            </div>
                                        )}
                                        {candidate.email && (
                                            <div className="flex items-center gap-1.5">
                                                <Mail className="h-4 w-4" />
                                                {candidate.email}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4" />
                                            Joined {candidate.createdAt?.toDate().toLocaleDateString() || "Recently"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-2 md:mt-0">
                                    <Button onClick={() => window.location.href = `mailto:${candidate.email}`} disabled={!candidate.email}>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Contact
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* About Section */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader>
                            <CardTitle>About</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 leading-relaxed">
                                {candidate.bio || `No bio available for ${candidate.displayName || "this candidate"}.`}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Certificates Section */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Certifications & Achievements</CardTitle>
                            <Badge variant="secondary">{certificates.length}</Badge>
                        </CardHeader>
                        <CardContent>
                            {certificates.length > 0 ? (
                                <div className="grid gap-4">
                                    {certificates.map((cert) => (
                                        <div key={cert.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-200 group">
                                            <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                <Award className="h-6 w-6 text-amber-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 group-hover:text-[#354fd2] transition-colors truncate">{cert.courseName || "Coding Certification"}</h4>
                                                <p className="text-sm text-gray-500 mb-1">Issued on {cert.issuedAt?.toDate().toLocaleDateString()}</p>
                                                <Badge variant="outline" className="bg-white text-xs font-normal truncate">
                                                    ID: {cert.id}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 sm:flex-none border-gray-200 text-gray-600 hover:text-[#354fd2] hover:border-[#354fd2]"
                                                    onClick={() => handleViewCertificate(cert)}
                                                >
                                                    <Eye className="h-3.5 w-3.5 mr-2" />
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white shadow-sm"
                                                    onClick={() => handleVerifyCertificate(cert.id)}
                                                >
                                                    <CheckCircle className="h-3.5 w-3.5 mr-2" />
                                                    Verify
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No certifications earned yet.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Platform Stats Card */}
                    {stats && (
                        <Card className="border-gray-100 shadow-sm bg-gradient-to-br from-slate-50 to-white">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-amber-500" />
                                    Platform Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-3 rounded-lg border border-gray-100 text-center shadow-sm">
                                        <div className="flex items-center justify-center mb-1 text-orange-500">
                                            <Zap className="h-4 w-4" />
                                        </div>
                                        <div className="text-xl font-bold text-gray-900">{stats.streak}</div>
                                        <div className="text-xs text-gray-500">Day Streak</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-gray-100 text-center shadow-sm">
                                        <div className="flex items-center justify-center mb-1 text-yellow-500">
                                            <Trophy className="h-4 w-4" />
                                        </div>
                                        <div className="text-xl font-bold text-gray-900">{stats.totalXP ? stats.totalXP.toLocaleString() : 0}</div>
                                        <div className="text-xs text-gray-500">Total XP</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-gray-100 text-center shadow-sm">
                                        <div className="flex items-center justify-center mb-1 text-blue-500">
                                            <Code className="h-4 w-4" />
                                        </div>
                                        <div className="text-xl font-bold text-gray-900">{stats.challengesCompleted}</div>
                                        <div className="text-xs text-gray-500">Challenges</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-gray-100 text-center shadow-sm">
                                        <div className="flex items-center justify-center mb-1 text-purple-500">
                                            <Video className="h-4 w-4" />
                                        </div>
                                        <div className="text-xl font-bold text-gray-900">{stats.interviewsCompleted}</div>
                                        <div className="text-xs text-gray-500">Interviews</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Skills Card */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {candidate.skill && (
                                    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-0 px-3 py-1.5 text-sm">
                                        {candidate.skill}
                                    </Badge>
                                )}
                                {/* Placeholder skills simulation if none exist in DB */}
                                {(!candidate.skill) && (
                                    <span className="text-sm text-gray-500 italic">No skills listed</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Experience Card */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Experience</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-3">
                                <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900">{candidate.experienceLevel || "Not specified"}</p>
                                    <p className="text-sm text-gray-500">Experience Level</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Certificate Details Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Award className="h-5 w-5 text-amber-500" />
                            Certificate Details
                        </DialogTitle>
                        <DialogDescription>
                            Verify the authenticity of this certification.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedCertificate && (
                        <div className="space-y-6 py-4">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
                                <div className="text-3xl mb-2">🎓</div>
                                <h3 className="font-playfair font-bold text-lg text-slate-900 mb-1">
                                    {selectedCertificate.courseName || "Coding Certification"}
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Earned by {candidate.displayName || "Candidate"}
                                </p>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Certificate ID</span>
                                    <span className="font-mono font-medium text-gray-700">{selectedCertificate.id}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Issued On</span>
                                    <span className="font-medium text-gray-700">
                                        {selectedCertificate.issuedAt?.toDate().toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Track</span>
                                    <span className="font-medium text-gray-700">
                                        {selectedCertificate.trackTitle || "General Track"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Close
                        </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white gap-2"
                            onClick={() => selectedCertificate && handleVerifyCertificate(selectedCertificate.id)}
                        >
                            <ExternalLink className="h-4 w-4" />
                            Verify Authenticity
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
