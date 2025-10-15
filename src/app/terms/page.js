import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  FileText,
  Calendar,
  AlertCircle,
  Scale,
  Users,
  Shield,
  Gavel,
  CheckCircle
} from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "October 1, 2025";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Settings
              </Button>
            </Link>
            <Image 
              src="/logo/techterview_wordmark_colored.png" 
              alt="TechTerview" 
              width={140} 
              height={26} 
              className="h-auto"
            />
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#354fd2] rounded-full mb-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4 font-playfair">
              Terms of Use
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Last updated: {lastUpdated}
              </div>
              <Badge variant="secondary">Version 1.0</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-[#354fd2]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Welcome to TechTerview
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  These Terms of Use ("Terms") govern your use of TechTerview, an AI-powered technical interview preparation platform. 
                  By accessing or using our services, you agree to be bound by these Terms. Please read them carefully.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-6">
          
          {/* Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#354fd2]" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  By creating an account, accessing, or using TechTerview, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, 
                  you may not use our services.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  These Terms apply to all users, including candidates, recruiters, and any other individuals who access or use our platform.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#354fd2]" />
                2. Service Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  TechTerview provides an AI-powered platform for technical interview preparation, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                  <li>Coding challenges and algorithmic problems</li>
                  <li>Mock interview simulations with AI-powered feedback</li>
                  <li>Personalized learning paths and progress tracking</li>
                  <li>AI mentor guidance and career advice</li>
                  <li>Interview scheduling and management tools</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  Our services are provided "as is" and we reserve the right to modify, suspend, or discontinue 
                  any part of our services at any time.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts and Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#354fd2]" />
                3. User Accounts and Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <h4 className="font-semibold text-gray-900 mb-3">Account Creation</h4>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You must provide accurate, current, and complete information when creating your account. 
                  You are responsible for maintaining the confidentiality of your account credentials.
                </p>
                
                <h4 className="font-semibold text-gray-900 mb-3">User Conduct</h4>
                <p className="text-gray-600 leading-relaxed mb-4">You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                  <li>Use the service for any unlawful purpose or in violation of these Terms</li>
                  <li>Share your account with others or allow unauthorized access</li>
                  <li>Attempt to circumvent any security measures or access restrictions</li>
                  <li>Upload or transmit malicious code, viruses, or harmful content</li>
                  <li>Interfere with or disrupt the service or servers</li>
                  <li>Use automated tools to access the service without permission</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-[#354fd2]" />
                4. Intellectual Property Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <h4 className="font-semibold text-gray-900 mb-3">Our Content</h4>
                <p className="text-gray-600 leading-relaxed mb-4">
                  TechTerview and its content, including but not limited to text, graphics, logos, coding challenges, 
                  AI models, and software, are owned by TechTerview and protected by intellectual property laws.
                </p>
                
                <h4 className="font-semibold text-gray-900 mb-3">User Content</h4>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You retain ownership of any code, solutions, or content you create using our platform. 
                  By using our services, you grant us a limited license to use your content for service improvement 
                  and analytics purposes, in accordance with our Privacy Policy.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy and Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#354fd2]" />
                5. Privacy and Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Your privacy is important to us. Our collection, use, and protection of your personal information 
                  is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  By using our services, you consent to the collection and use of your information as described 
                  in our Privacy Policy.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-[#354fd2]" />
                6. Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, TECHTERVIEW SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, 
                  LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our total liability to you for all claims arising out of or relating to these Terms or 
                  your use of our services shall not exceed the amount you paid us in the 12 months preceding the claim.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-[#354fd2]" />
                7. Termination
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  You may terminate your account at any time by contacting us at support@techterview.com. 
                  We may suspend or terminate your account if you violate these Terms or for any other reason 
                  at our sole discretion.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Upon termination, your right to use our services will cease immediately, and we may delete 
                  your account data in accordance with our Privacy Policy.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#354fd2]" />
                8. Changes to Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  We reserve the right to modify these Terms at any time. We will notify you of any material 
                  changes by email or through our platform. Your continued use of our services after such 
                  modifications constitutes acceptance of the updated Terms.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-[#354fd2]" />
                9. Governing Law and Disputes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction], 
                  without regard to conflict of law principles.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Any disputes arising out of or relating to these Terms or your use of our services shall be 
                  resolved through binding arbitration or in the courts of [Your Jurisdiction].
                </p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Contact Information */}
        <Card className="mt-8 bg-[#354fd2] text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About Our Terms?</h2>
            <p className="mb-6 opacity-90">
              If you have any questions about these Terms of Use, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" className="bg-white text-[#354fd2] hover:bg-gray-100">
                <FileText className="h-4 w-4 mr-2" />
                Email Legal Team
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#354fd2]">
                support@techterview.com
              </Button>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm opacity-75">
                TechTerview Legal Department • Last updated: {lastUpdated}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}