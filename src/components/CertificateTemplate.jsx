import React, { forwardRef } from 'react';
import Image from 'next/image';
import { Award } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const CertificateTemplate = forwardRef(({ userName, trackName, date, trackId, certificateId }, ref) => {
    const verificationUrl = typeof window !== 'undefined' ? `${window.location.origin}/verify/${certificateId}` : '';

    return (
        <div
            ref={ref}
            className="p-6 relative overflow-hidden font-sans"
            style={{
                width: '800px',
                height: '600px',
                border: '10px solid #354fd2',
                position: 'relative',
                backgroundColor: '#ffffff',
                color: '#0f172a', // slate-900
                boxSizing: 'border-box'
            }}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.05 }}>
                <div className="absolute top-0 left-0 w-full h-full"
                    style={{
                        background: 'radial-gradient(circle at center, #2563eb 0%, transparent 70%)', // blue-600
                        backgroundSize: '20px 20px'
                    }}>
                </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-32 h-32" style={{ borderTop: '20px solid #354fd2', borderLeft: '20px solid #354fd2' }}></div>
            <div className="absolute bottom-0 right-0 w-32 h-32" style={{ borderBottom: '20px solid #354fd2', borderRight: '20px solid #354fd2' }}></div>

            <div className="h-full flex flex-col items-center justify-between py-4 text-center relative z-10">

                {/* Header */}
                <div className="flex flex-col items-center gap-1">
                    <div className="relative w-56 h-14">
                        <img
                            src="/logo/techterview_wordmark_colored.png"
                            alt="TechTerview"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    </div>
                    <div className="flex items-center gap-2 font-bold tracking-widest uppercase text-xs mt-1" style={{ color: '#354fd2' }}>
                        <Award className="w-4 h-4" />
                        Certificate of Completion
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col justify-center gap-2 w-full max-w-2xl">
                    <p className="text-lg font-playfair italic" style={{ color: '#64748b' }}>This is to certify that</p> {/* slate-500 */}

                    <h1 className="text-4xl font-bold font-playfair pb-2 mx-auto min-w-[400px]" style={{ color: '#0f172a', borderBottom: '2px solid #e2e8f0' }}> {/* slate-900, slate-200 */}
                        {userName}
                    </h1>

                    <p className="text-lg font-playfair italic mt-2" style={{ color: '#64748b' }}>has successfully completed the interview track</p>

                    <h2 className="text-3xl font-bold font-playfair" style={{ color: '#354fd2' }}>
                        {trackName}
                    </h2>

                    <p className="mt-2 max-w-lg mx-auto text-sm" style={{ color: '#475569' }}> {/* slate-600 */}
                        Demonstrating proficiency in technical concepts, problem-solving, and interview readiness through comprehensive lessons and assessments.
                    </p>
                </div>

                {/* Footer */}
                <div className="w-full flex justify-between items-end px-8 mt-2">
                    <div className="text-left flex flex-col gap-1">
                        <div>
                            <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>Date Issued</p> {/* slate-400 */}
                            <p className="font-medium text-base pt-1 px-2 min-w-[120px]" style={{ borderTop: '1px solid #cbd5e1', color: '#0f172a' }}> {/* slate-300 */}
                                {date}
                            </p>
                        </div>
                        {certificateId && (
                            <div className="mt-2 text-left">
                                <QRCodeCanvas value={verificationUrl} size={56} />
                                <div className="text-[6px] mt-1 max-w-[160px] break-all" style={{ color: '#94a3b8' }}>
                                    {verificationUrl}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 relative mb-2" style={{ opacity: 0.2 }}>
                            <img
                                src="/logo/techterview_symbol.png"
                                alt="Seal"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="h-10 w-32 relative mb-1 mx-auto">
                            <img
                                src="/assets/kiko_signature.png"
                                alt="Signature"
                                style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.8 }}
                            />
                        </div>
                        <p className="font-medium text-base pt-1 px-2 min-w-[120px]" style={{ borderTop: '1px solid #cbd5e1', color: '#0f172a' }}>
                            Francis Mistica
                        </p>
                        <p className="text-xs px-3" style={{ color: '#94a3b8' }}>CEO, TechTerview  </p>
                    </div>
                </div>
            </div>
        </div>
    );
});

CertificateTemplate.displayName = 'CertificateTemplate';

export default CertificateTemplate;
