"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCertificate } from '@/lib/firestore_modules/certificates';
import { CheckCircle2, XCircle, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function VerifyCertificatePage() {
    const params = useParams();
    const { id } = params;
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCertificate = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const cert = await getCertificate(id);

                if (cert) {
                    setCertificate(cert);
                } else {
                    setError("Certificate not found");
                }
            } catch (err) {
                console.error("Error verifying certificate:", err);
                setError("Failed to verify certificate");
            } finally {
                setLoading(false);
            }
        };

        fetchCertificate();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
            {/* Header */}
            <div className="mb-8">
                <Link href="/">
                    <div className="relative w-48 h-12">
                        <Image
                            src="/logo/techterview_wordmark_colored.png"
                            alt="TechTerview"
                            fill
                            className="object-contain"
                        />
                    </div>
                </Link>
            </div>

            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border">
                {error ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                            <XCircle className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Certificate</h1>
                        <p className="text-slate-600">
                            We could not find a valid certificate with ID: <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">{id}</span>
                        </p>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Verified Certificate</h1>
                        <p className="text-green-600 font-medium mb-6">This certificate is valid and authentic.</p>

                        <div className="space-y-6 text-left border-t pt-6">
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Issued To</p>
                                <p className="text-lg font-semibold text-slate-900">{certificate.userName}</p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Track Completed</p>
                                <div className="flex items-center gap-2 text-[#354fd2] font-medium">
                                    <Award className="w-5 h-5" />
                                    {certificate.trackTitle}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Date Issued</p>
                                <p className="text-slate-700">
                                    {certificate.issuedAt?.toDate ? certificate.issuedAt.toDate().toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : 'Recently'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Certificate ID</p>
                                <p className="font-mono text-xs text-slate-500 break-all bg-slate-50 p-2 rounded border">
                                    {certificate.id}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 text-center text-sm text-slate-500">
                <p>&copy; {new Date().getFullYear()} TechTerview. All rights reserved.</p>
            </div>
        </div>
    );
}
