import React from 'react';
import HeaderSection from './components/HeaderSection';
import StatsSection from './components/StatsSection';
import PracticeSection from './components/PracticeSection';
import HistorySection from './components/HistorySection';

import CertificateBanner from './components/CertificateBanner';

export const metadata = {
    title: 'Mock Interviews | Techterview',
    description: 'Practice your interview skills with AI-powered mock interviews.',
};

const MockInterviewsPage = () => {
    return (
        <div className="container mx-auto p-6 max-w-7xl space-y-8">
            <HeaderSection />
            <StatsSection />
            <PracticeSection />
            <CertificateBanner />
            <HistorySection />
        </div>
    );
};

export default MockInterviewsPage;
