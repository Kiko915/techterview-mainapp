"use client";

import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, PartyPopper } from 'lucide-react';
import CertificateTemplate from './CertificateTemplate';
import { toast } from 'sonner';
import { createCertificate } from '@/lib/firestore_modules/certificates';
import { useAuth } from '@/lib/useAuth';

export default function TrackCompletionModal({ isOpen, onClose, userName, trackName, trackId }) {
    const certificateRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [certificateId, setCertificateId] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (isOpen && user && trackId) {
            // Create or fetch certificate
            const initCertificate = async () => {
                try {
                    const cert = await createCertificate(user.uid, trackId, trackName, userName);
                    setCertificateId(cert.id);
                } catch (error) {
                    console.error("Failed to initialize certificate:", error);
                    toast.error("Failed to generate certificate ID");
                }
            };
            initCertificate();

            // Fire confetti
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min, max) => Math.random() * (max - min) + min;

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isOpen, user, trackId, trackName, userName]);

    const handleDownload = async () => {
        if (!certificateRef.current) return;

        try {
            setIsDownloading(true);
            toast.info("Generating certificate...");

            const canvas = await html2canvas(certificateRef.current, {
                scale: 2, // Higher quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [800, 600]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, 800, 600);
            pdf.save(`TechTerview-Certificate-${trackName.replace(/\s+/g, '-')}.pdf`);

            toast.success("Certificate downloaded successfully!");
        } catch (error) {
            console.error("Error generating certificate:", error);
            toast.error("Failed to generate certificate");
        } finally {
            setIsDownloading(false);
        }
    };

    const formattedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto flex flex-col items-center">
                <DialogHeader className="text-center items-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-yellow-600">
                        <PartyPopper className="w-8 h-8" />
                    </div>
                    <DialogTitle className="text-3xl font-bold font-playfair text-[#354fd2]">
                        Track Completed!
                    </DialogTitle>
                    <DialogDescription className="text-lg text-slate-600 max-w-md mx-auto mt-2">
                        Congratulations, {userName}! You've successfully mastered the <span className="font-semibold text-slate-900">{trackName}</span>.
                    </DialogDescription>
                </DialogHeader>

                {/* Certificate Preview Area */}
                <div className="w-full my-4 overflow-x-auto border rounded-lg shadow-sm bg-slate-50 py-4">
                    <div className="relative mx-auto" style={{ width: '500px', height: '375px' }}>
                        <div className="absolute inset-0 origin-top-left transform scale-[0.625]" style={{ width: '800px', height: '600px' }}>
                            <CertificateTemplate
                                // No ref here, this is just for display
                                userName={userName}
                                trackName={trackName}
                                trackId={trackId}
                                date={formattedDate}
                                certificateId={certificateId}
                            />
                        </div>
                    </div>
                </div>

                {/* Hidden Certificate for Generation - Positioned off-screen but rendered at full size */}
                <div className="fixed top-0 left-0 pointer-events-none opacity-0" style={{ transform: 'translateX(-9999px)' }}>
                    <div style={{ width: '800px', height: '600px' }}>
                        <CertificateTemplate
                            ref={certificateRef} // Ref attached here for html2canvas
                            userName={userName}
                            trackName={trackName}
                            trackId={trackId}
                            date={formattedDate}
                            certificateId={certificateId}
                        />
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-3 w-full justify-center sm:justify-center">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="w-full sm:w-auto"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleDownload}
                        disabled={isDownloading || !certificateId}
                        className="w-full sm:w-auto bg-[#354fd2] hover:bg-[#2a3fca] gap-2"
                    >
                        <Download className="w-4 h-4" />
                        {isDownloading ? "Generating..." : "Download Certificate"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
