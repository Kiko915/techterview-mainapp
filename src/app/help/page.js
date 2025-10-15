"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";
import {
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Mail,
  Phone,
  ArrowLeft,
  ExternalLink,
  Users,
  Code,
  Video,
  Bot,
  Settings,
  Shield,
  CreditCard
} from "lucide-react";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // FAQ Categories
  const faqCategories = [
    {
      title: "Getting Started",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      faqs: [
        {
          question: "How do I create an account on TechTerview?",
          answer: "To create an account, click on the 'Sign Up' button on the login page. Fill in your email, password, and confirm password. After signing up, you'll be guided through an onboarding process to set up your profile and preferences."
        },
        {
          question: "What information do I need to complete my profile?",
          answer: "During onboarding, you'll need to provide your username, full name, select your role (Candidate or Recruiter), choose your skill level, and indicate your experience level. This helps us tailor the platform to your needs."
        },
        {
          question: "How do I navigate the dashboard?",
          answer: "The dashboard features a sidebar with main sections: Overview, Coding Challenge, Mock Interviews, AI Mentor, Learning Path, Progress, and Settings. Click on any section to access its features. The sidebar can be collapsed to save space."
        }
      ]
    },
    {
      title: "Coding Challenges",
      icon: Code,
      color: "bg-green-100 text-green-600",
      faqs: [
        {
          question: "What types of coding challenges are available?",
          answer: "TechTerview offers various coding challenges including algorithm problems, data structures, system design questions, and language-specific challenges. Questions range from beginner to expert level."
        },
        {
          question: "How are coding challenges graded?",
          answer: "Challenges are automatically graded based on correctness, efficiency, and code quality. You'll receive immediate feedback with test case results and performance metrics."
        },
        {
          question: "Can I practice in my preferred programming language?",
          answer: "Yes! TechTerview supports multiple programming languages including Python, JavaScript, Java, C++, and more. You can select your preferred language before starting any challenge."
        }
      ]
    },
    {
      title: "Mock Interviews",
      icon: Video,
      color: "bg-purple-100 text-purple-600",
      faqs: [
        {
          question: "How do mock interviews work?",
          answer: "Mock interviews simulate real interview scenarios with AI-powered interviewers or scheduled sessions with human reviewers. You'll receive questions, provide answers, and get detailed feedback on your performance."
        },
        {
          question: "What types of interview questions are covered?",
          answer: "We cover technical coding questions, system design, behavioral questions, and role-specific scenarios. Questions are tailored to your experience level and target positions."
        },
        {
          question: "How do I schedule a mock interview?",
          answer: "Go to the Mock Interviews section, select your preferred interview type and time slot. You can choose between AI-powered instant interviews or scheduled sessions with human interviewers."
        }
      ]
    },
    {
      title: "AI Mentor",
      icon: Bot,
      color: "bg-orange-100 text-orange-600",
      faqs: [
        {
          question: "What can the AI Mentor help me with?",
          answer: "The AI Mentor provides personalized guidance on coding concepts, career advice, interview preparation tips, and learning path recommendations. It adapts to your skill level and learning goals."
        },
        {
          question: "How accurate is the AI Mentor's advice?",
          answer: "Our AI Mentor is trained on industry best practices and continuously updated. While highly accurate, we recommend using it as a guide alongside other learning resources and human expertise."
        },
        {
          question: "Can I ask the AI Mentor about specific coding problems?",
          answer: "Absolutely! You can ask about specific algorithms, debugging help, code optimization, best practices, and get explanations for complex concepts. The AI provides detailed, step-by-step guidance."
        }
      ]
    },
    {
      title: "Account & Settings",
      icon: Settings,
      color: "bg-gray-100 text-gray-600",
      faqs: [
        {
          question: "How do I change my password?",
          answer: "Go to My Account → Security Settings. Enter your current password, then your new password twice. Click 'Update Password' to save changes. Make sure your new password is secure."
        },
        {
          question: "Can I update my profile information?",
          answer: "Yes, go to My Account → Personal Information. You can update your name, email, username, country, and address. Some fields like role and joined date cannot be changed."
        },
        {
          question: "How do I delete my account?",
          answer: "Account deletion is permanent and cannot be undone. Please contact our support team at support@techterview.com to request account deletion. We'll verify your identity before processing the request."
        }
      ]
    },
    {
      title: "Technical Support",
      icon: Shield,
      color: "bg-red-100 text-red-600",
      faqs: [
        {
          question: "I'm experiencing technical issues. What should I do?",
          answer: "Try refreshing the page or clearing your browser cache first. If the issue persists, check our status page or contact support with details about the problem, your browser, and any error messages."
        },
        {
          question: "Which browsers are supported?",
          answer: "TechTerview works best on modern browsers: Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. For the best experience, ensure JavaScript is enabled and your browser is up to date."
        },
        {
          question: "Is my data secure on TechTerview?",
          answer: "Yes, we use industry-standard encryption and security measures to protect your data. We don't share personal information with third parties without your consent. See our Privacy Policy for details."
        }
      ]
    }
  ];

  // Filter FAQs based on search query
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
            <Image 
              src="/logo/techterview_wordmark_colored.png" 
              alt="TechTerview" 
              width={140} 
              height={26} 
              className="h-auto"
            />
          </div>
          
          <div className="text-center mt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#354fd2] rounded-full mb-4">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4 font-playfair">
              How can we help you?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions, get support, and learn how to make the most of TechTerview.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for help topics, features, or questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
          </CardContent>
        </Card>

        {searchQuery && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredCategories.reduce((total, cat) => total + cat.faqs.length, 0)} results for "{searchQuery}"
            </p>
          </div>
        )}

        {/* Quick Links */}
        {!searchQuery && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Quick Help</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Book className="h-8 w-8 text-[#354fd2] mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">User Guide</h3>
                  <p className="text-sm text-muted-foreground">Complete guide to using TechTerview</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-8 w-8 text-[#354fd2] mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">Chat with our support team</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Video className="h-8 w-8 text-[#354fd2] mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Video Tutorials</h3>
                  <p className="text-sm text-muted-foreground">Learn with step-by-step videos</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* FAQ Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {filteredCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <category.icon className="h-5 w-5" />
                    </div>
                    {category.title}
                    <Badge variant="secondary" className="ml-auto">
                      {category.faqs.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                        <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <Card className="bg-[#354fd2] text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
            <p className="mb-6 opacity-90">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" className="bg-white text-[#354fd2] hover:bg-gray-100">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Button>
              <Button variant="secondary" className="border-white text-[#354fd2] hover:bg-gray-200">
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Live Chat
              </Button>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm opacity-75">
                Response time: Usually within 24 hours
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}