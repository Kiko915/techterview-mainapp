"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { getUserCertificates } from '@/lib/firestore_modules/certificates';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, ExternalLink, Calendar, Eye } from 'lucide-react';
import Link from 'next/link';
import CertificateViewModal from '@/components/CertificateViewModal';

export default function CertificatesPage() {
    const { user } = useAuth();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCertificate, setSelectedCertificate] = useState(null);

    useEffect(() => {
        const fetchCertificates = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const certs = await getUserCertificates(user.uid);
                setCertificates(certs);
            } catch (error) {
                console.error("Error fetching certificates:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2 font-playfair">My Certificates</h1>
                <p className="text-muted-foreground">
                    View and verify your earned certificates from completed interview tracks.
                </p>
            </div>

            {certificates.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl bg-slate-50">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Award className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                        Complete an interview track to earn your first certificate of completion.
                    </p>
                    <Link href="/dashboard">
                        <Button>Browse Tracks</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                        <Card key={cert.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                            <div className="h-2 bg-[#354fd2]"></div>
                            <CardHeader>
                                <div className="flex items-center gap-2 text-[#354fd2] font-medium text-sm mb-2">
                                    <Award className="w-4 h-4" />
                                    Certificate of Completion
                                </div>
                                <CardTitle className="line-clamp-2">{cert.trackTitle}</CardTitle>
                                <CardDescription>
                                    Issued to {cert.userName}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {cert.issuedAt?.toDate ? cert.issuedAt.toDate().toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'Recently'}
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50 border-t p-4 grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    className="w-full gap-2"
                                    onClick={() => setSelectedCertificate(cert)}
                                >
                                    <Eye className="w-4 h-4" />
                                    View
                                </Button>
                                <Link href={`/verify/${cert.id}`} target="_blank" className="w-full">
                                    <Button variant="ghost" className="w-full gap-2">
                                        <ExternalLink className="w-4 h-4" />
                                        Verify
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            <CertificateViewModal
                isOpen={!!selectedCertificate}
                onClose={() => setSelectedCertificate(null)}
                certificate={selectedCertificate}
            />
        </div>
    );
}
