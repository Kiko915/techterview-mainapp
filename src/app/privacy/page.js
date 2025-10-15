import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Shield,
  Calendar,
  Lock,
  Eye,
  Database,
  Users,
  Settings,
  AlertCircle,
  Mail,
  Globe,
  CheckCircle
} from "lucide-react";

export default function PrivacyPage() {
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
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4 font-playfair">
              Privacy Policy
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
                <Lock className="h-6 w-6 text-[#354fd2]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Your Privacy Matters to Us
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  At TechTerview, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Sections */}
        <div className="space-y-6">
          
          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-[#354fd2]" />
                1. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                <p className="text-gray-600 leading-relaxed mb-4">
                  When you create an account or use our services, we may collect:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                  <li>Name, email address, and username</li>
                  <li>Professional information (job title, experience level, skills)</li>
                  <li>Profile information and preferences</li>
                  <li>Account settings and notification preferences</li>
                </ul>
                
                <h4 className="font-semibold text-gray-900 mb-3">Usage Information</h4>
                <p className="text-gray-600 leading-relaxed mb-4">We automatically collect information about your use of our platform:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                  <li>Coding solutions, interview responses, and performance data</li>
                  <li>Learning progress and assessment results</li>
                  <li>Platform usage patterns and feature interactions</li>
                  <li>Device information, IP addresses, and browser data</li>
                  <li>Log files and analytics data</li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3">Content You Create</h4>
                <p className="text-gray-600 leading-relaxed">
                  We store code submissions, interview recordings (if applicable), notes, and other content you create 
                  while using our platform to provide personalized feedback and track your progress.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#354fd2]" />
                2. How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">We use your information to:</p>
                <div className="grid gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Provide Our Services</h5>
                      <p className="text-gray-600 text-sm">Create and maintain your account, deliver coding challenges, conduct mock interviews, and provide AI-powered feedback.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Personalization</h5>
                      <p className="text-gray-600 text-sm">Customize learning paths, recommend relevant content, and adapt the platform to your skill level and goals.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Communication</h5>
                      <p className="text-gray-600 text-sm">Send important updates, respond to support requests, and provide customer service.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Platform Improvement</h5>
                      <p className="text-gray-600 text-sm">Analyze usage patterns, improve our AI models, and develop new features based on user needs.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Security & Compliance</h5>
                      <p className="text-gray-600 text-sm">Protect against fraud, maintain security, and comply with legal obligations.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#354fd2]" />
                3. How We Share Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                  except in the following circumstances:
                </p>
                
                <h4 className="font-semibold text-gray-900 mb-3">Service Providers</h4>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may share information with trusted third-party service providers who assist us in operating our platform, 
                  such as cloud hosting, analytics, and customer support services.
                </p>

                <h4 className="font-semibold text-gray-900 mb-3">Legal Requirements</h4>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may disclose your information when required by law, court order, or government request, or to protect 
                  our rights, property, or safety.
                </p>

                <h4 className="font-semibold text-gray-900 mb-3">Business Transfers</h4>
                <p className="text-gray-600 leading-relaxed">
                  In the event of a merger, acquisition, or sale of assets, user information may be transferred as part 
                  of the transaction, subject to the same privacy protections.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-[#354fd2]" />
                4. Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure authentication and authorization protocols</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and monitoring systems</li>
                  <li>Employee training on data protection practices</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  While we strive to protect your information, no method of transmission over the internet or electronic 
                  storage is 100% secure. We cannot guarantee absolute security but are committed to protecting your data 
                  to the best of our ability.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-[#354fd2]" />
                5. Your Privacy Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <div className="grid gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Access & Portability</h5>
                    <p className="text-gray-600 text-sm">Request access to your personal data and receive a copy in a portable format.</p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Correction</h5>
                    <p className="text-gray-600 text-sm">Update or correct inaccurate personal information in your account settings.</p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Deletion</h5>
                    <p className="text-gray-600 text-sm">Request deletion of your personal data, subject to certain legal obligations.</p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Opt-out</h5>
                    <p className="text-gray-600 text-sm">Withdraw consent or opt-out of certain data processing activities.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#354fd2]" />
                6. Cookies and Tracking Technologies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to enhance your experience:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                  <li><strong>Essential Cookies:</strong> Required for basic platform functionality and security</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Performance Cookies:</strong> Optimize loading times and user experience</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  You can manage your cookie preferences through your browser settings, though disabling certain cookies 
                  may affect platform functionality.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-[#354fd2]" />
                7. Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  We retain your information for as long as necessary to provide our services and fulfill the purposes 
                  outlined in this policy:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                  <li>Account information: Until you delete your account</li>
                  <li>Learning progress data: Retained to track your improvement over time</li>
                  <li>Usage analytics: Aggregated and anonymized data may be retained indefinitely</li>
                  <li>Legal compliance: As required by applicable laws and regulations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-[#354fd2]" />
                8. Children's Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  TechTerview is not intended for children under 13 years of age. We do not knowingly collect personal 
                  information from children under 13. If we become aware that we have collected personal information 
                  from a child under 13, we will take steps to delete such information promptly.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#354fd2]" />
                9. Changes to This Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for other 
                  operational, legal, or regulatory reasons. We will notify you of any material changes by email or 
                  through our platform. Your continued use of our services after such modifications constitutes 
                  acceptance of the updated Privacy Policy.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Contact Information */}
        <Card className="mt-8 bg-[#354fd2] text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h2>
            <p className="mb-6 opacity-90">
              If you have any questions about this Privacy Policy or our data practices, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" className="bg-white text-[#354fd2] hover:bg-gray-100">
                <Mail className="h-4 w-4 mr-2" />
                Contact Privacy Team
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#354fd2]">
                privacy@techterview.com
              </Button>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm opacity-75">
                TechTerview Privacy Team • Last updated: {lastUpdated}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}