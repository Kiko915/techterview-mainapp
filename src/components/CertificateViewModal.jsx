"use client";

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from 'lucide-react';
import CertificateTemplate from './CertificateTemplate';
import { toast } from 'sonner';

export default function CertificateViewModal({ isOpen, onClose, certificate }) {
    const certificateRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    if (!certificate) return null;

    const { userName, trackTitle: trackName, trackId, id: certificateId, issuedAt } = certificate;

    const formattedDate = issuedAt?.toDate ? issuedAt.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto flex flex-col items-center">
                <DialogHeader className="text-center items-center w-full relative">
                    <DialogTitle className="text-2xl font-bold font-playfair text-[#354fd2]">
                        Certificate Preview
                    </DialogTitle>
                </DialogHeader>

                {/* Certificate Preview Area */}
                <div className="w-full my-4 overflow-x-auto border rounded-lg shadow-sm bg-slate-50 py-4">
                    <div className="relative mx-auto" style={{ width: '500px', height: '375px' }}>
                        <div className="absolute inset-0 origin-top-left transform scale-[0.625]" style={{ width: '800px', height: '600px' }}>
                            <CertificateTemplate
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
                        disabled={isDownloading}
                        className="w-full sm:w-auto bg-[#354fd2] hover:bg-[#2a3fca] gap-2"
                    >
                        <Download className="w-4 h-4" />
                        {isDownloading ? "Generating..." : "Download PDF"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
