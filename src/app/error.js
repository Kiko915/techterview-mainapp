'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  // Determine error type and status
  const getErrorInfo = () => {
    const message = error?.message || 'An unexpected error occurred';
    const digest = error?.digest || 'unknown';
    
    // Try to determine if it's a specific HTTP error
    if (message.includes('401') || message.toLowerCase().includes('unauthorized')) {
      return {
        code: '401',
        title: 'Unauthorized',
        description: 'You are not authorized to view this page.',
        icon: AlertTriangle
      };
    } else if (message.includes('403') || message.toLowerCase().includes('forbidden')) {
      return {
        code: '403',
        title: 'Forbidden',
        description: 'Access to this resource is forbidden.',
        icon: AlertTriangle
      };
    } else if (message.includes('404') || message.toLowerCase().includes('not found')) {
      return {
        code: '404',
        title: 'Not Found',
        description: 'The page you are looking for does not exist.',
        icon: AlertTriangle
      };
    } else if (message.includes('500') || message.toLowerCase().includes('server')) {
      return {
        code: '500',
        title: 'Server Error',
        description: 'Something went wrong on our end.',
        icon: Bug
      };
    } else {
      return {
        code: 'Error',
        title: 'Something went wrong',
        description: 'An unexpected error occurred while processing your request.',
        icon: Bug
      };
    }
  };

  const errorInfo = getErrorInfo();
  const ErrorIcon = errorInfo.icon;

  return (
    <div className="min-h-screen bg-[#f0f7ff] relative flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <div className="mb-10">
        <Logo variant="wordmark" width={283} height={53} />
      </div>
      
      {/* Main Content */}
      <div className="text-center max-w-2xl mx-auto">
        

        {/* Error Code/Number */}
        <h1 className="font-playfair font-bold text-[128px] leading-[64px] text-[#141414] mb-4">
          {errorInfo.code}
        </h1>
        
        {/* Error Title */}
        <h2 className="font-montserrat font-bold text-[32px] text-black mb-4 tracking-[0.16px]">
          {errorInfo.title}
        </h2>
        
        {/* Error Description */}
        <p className="font-montserrat text-base text-black mb-8 tracking-[0.08px]">
          {errorInfo.description}
        </p>

        {/* Error Details Card */}
        <Card className="mb-8 text-left bg-white/50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Error Details
            </CardTitle>
            <CardDescription>
              Technical information for debugging
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">Error Message:</p>
              <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded mt-1">
                {error?.message || 'No error message available'}
              </p>
            </div>
            {error?.digest && (
              <div>
                <p className="text-sm font-semibold text-gray-700">Error Digest:</p>
                <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded mt-1">
                  {error.digest}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-700">Timestamp:</p>
              <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded mt-1">
                {new Date().toISOString()}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={reset}
            className="bg-[#354fd2] text-white px-6 py-3 rounded-full min-w-[180px] h-[42px] hover:bg-[#2a3fa8] transition-colors font-medium text-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          
          <Link href="/">
            <Button 
              variant="outline"
              className="border-[#354fd2] text-[#354fd2] px-6 py-3 rounded-full min-w-[180px] h-[42px] hover:bg-[#354fd2] hover:text-white transition-colors font-medium text-sm flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-8">
        <p className="font-montserrat font-light text-[11px] text-black tracking-[0.055px]">
          © 2025 TechTerview. All rights reserved.
        </p>
      </div>
    </div>
  );
}