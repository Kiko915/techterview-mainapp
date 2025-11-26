import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const CertificateBanner = () => {
    return (
        <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300">
            <Info className="h-4 w-4 !text-blue-500" />
            <AlertTitle className="text-blue-700 dark:text-blue-300">Want to earn a certificate?</AlertTitle>
            <AlertDescription className="text-blue-600/90 dark:text-blue-400/90">
                Make sure to take the Mock Interview related to your selected track
            </AlertDescription>
        </Alert>
    );
};

export default CertificateBanner;
