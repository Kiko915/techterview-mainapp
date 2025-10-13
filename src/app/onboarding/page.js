"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronLeft, User, UserCheck, IdCard } from "lucide-react";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    role: "candidate", // candidate or recruiter
    skillLevel: "", // beginner, intermediate, expert
    experienceLevel: "", // Select an item
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      role: role
    }));
  };

  const handleExperienceSelect = (level) => {
    setFormData(prev => ({
      ...prev,
      experienceLevel: level
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getProgressWidth = () => {
    return (currentStep / totalSteps) * 100;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 nextStep={nextStep} />;
      case 2:
        return <Step2 formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <Step3 formData={formData} handleRoleSelect={handleRoleSelect} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <Step4 formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
      case 5:
        return <Step5 formData={formData} handleExperienceSelect={handleExperienceSelect} nextStep={nextStep} prevStep={prevStep} />;
      case 6:
        return <Step6 formData={formData} prevStep={prevStep} />;
      default:
        return <Step1 nextStep={nextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff] relative">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-4 bg-[#354fd2] transition-all duration-300 ease-in-out" 
           style={{ width: `${getProgressWidth()}%` }}>
      </div>
      
      {renderStep()}
    </div>
  );
}

// Step 1: Welcome
function Step1({ nextStep }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center">
        <div className="mb-12">
          <Image
            src="/logo/techterview_symbol_colored.png"
            alt="TechTerview Logo"
            width={130}
            height={130}
            className="mx-auto"
          />
        </div>
        
        <h1 className="font-playfair font-bold text-5xl text-black mb-6">
          We want to know more.
        </h1>
        
        <p className="text-2xl text-black max-w-2xl mx-auto mb-12 leading-relaxed">
          We will ask some questions related to you, so that we can tailor the platform for you.
        </p>
        
        <Button 
          onClick={nextStep}
          className="bg-[#354fd2] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#2a3fa8] transition-colors min-w-[295px]"
        >
          Start Onboarding
        </Button>
      </div>
    </div>
  );
}

// Step 2: Basic Information
function Step2({ formData, handleInputChange, nextStep, prevStep }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center w-full max-w-2xl">
        <div className="mb-12">
          <Image
            src="/logo/techterview_symbol_colored.png"
            alt="TechTerview Logo"
            width={130}
            height={130}
            className="mx-auto"
          />
        </div>
        
        <h1 className="font-playfair font-bold text-5xl text-black mb-6">
          Basic Information
        </h1>
        
        <p className="text-2xl text-black max-w-2xl mx-auto mb-12 leading-relaxed">
          Tell us a bit about yourself.
        </p>
        
        <div className="space-y-6 mb-12">
          {/* Username Field */}
          <div className="text-left">
            <label className="text-xs font-semibold text-black tracking-wide block mb-2">
              USERNAME
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                name="username"
                placeholder="JohnDoe17"
                value={formData.username}
                onChange={handleInputChange}
                className="pl-12 h-12 w-full bg-white border border-gray-200 rounded-lg"
              />
            </div>
          </div>
          
          {/* Full Name Field */}
          <div className="text-left">
            <label className="text-xs font-semibold text-black tracking-wide block mb-2">
              FULL NAME
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                className="pl-12 h-12 w-full bg-white border border-gray-200 rounded-lg"
              />
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={prevStep}
            variant="outline"
            className="bg-white/10 border border-gray-300 text-black px-8 py-3 rounded-lg text-sm font-medium min-w-[250px] hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button 
            onClick={nextStep}
            className="bg-[#354fd2] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#2a3fa8] transition-colors min-w-[250px]"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Step 3: Role Selection
function Step3({ formData, handleRoleSelect, nextStep, prevStep }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center w-full max-w-4xl">
        <div className="mb-12">
          <Image
            src="/logo/techterview_symbol_colored.png"
            alt="TechTerview Logo"
            width={130}
            height={130}
            className="mx-auto"
          />
        </div>
        
        <h1 className="font-playfair font-bold text-5xl text-black mb-6">
          What is your role?
        </h1>
        
        <p className="text-2xl text-black max-w-2xl mx-auto mb-12 leading-relaxed">
          Are you a employer looking for employees, or vice-versa?
        </p>
        
        {/* Role Selection Cards */}
        <div className="flex justify-center gap-8 mb-12">
          {/* Recruiter Card */}
          <div 
            onClick={() => handleRoleSelect('recruiter')}
            className={`cursor-pointer p-8 rounded-xl border-2 transition-all duration-200 w-[270px] h-[139px] flex flex-col items-center justify-center ${
              formData.role === 'recruiter' 
                ? 'border-[#354fd2] bg-white' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-4 mb-2">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                formData.role === 'recruiter' 
                  ? 'border-[#354fd2]' 
                  : 'border-gray-300'
              }`}>
                {formData.role === 'recruiter' && (
                  <div className="w-2 h-2 bg-[#354fd2] rounded-full"></div>
                )}
              </div>
              <UserCheck className={`h-6 w-6 ${formData.role === 'recruiter' ? 'text-[#354fd2]' : 'text-gray-500'}`} />
            </div>
            <p className={`text-2xl font-medium ${formData.role === 'recruiter' ? 'text-[#354fd2]' : 'text-[#565656]'}`}>
              Recruiter
            </p>
          </div>
          
          {/* Candidate Card */}
          <div 
            onClick={() => handleRoleSelect('candidate')}
            className={`cursor-pointer p-8 rounded-xl border-2 transition-all duration-200 w-[270px] h-[139px] flex flex-col items-center justify-center ${
              formData.role === 'candidate' 
                ? 'border-[#354fd2] bg-white' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-4 mb-2">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                formData.role === 'candidate' 
                  ? 'border-[#354fd2]' 
                  : 'border-gray-300'
              }`}>
                {formData.role === 'candidate' && (
                  <div className="w-2 h-2 bg-[#354fd2] rounded-full"></div>
                )}
              </div>
              <IdCard className={`h-6 w-6 ${formData.role === 'candidate' ? 'text-[#354fd2]' : 'text-gray-500'}`} />
            </div>
            <p className={`text-2xl font-medium ${formData.role === 'candidate' ? 'text-[#354fd2]' : 'text-[#565656]'}`}>
              Candidate
            </p>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={prevStep}
            variant="outline"
            className="bg-white/10 border border-gray-300 text-black px-8 py-3 rounded-lg text-sm font-medium min-w-[250px] hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button 
            onClick={nextStep}
            className="bg-[#354fd2] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#2a3fa8] transition-colors min-w-[250px]"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Step 4: Skill Level
function Step4({ formData, handleInputChange, nextStep, prevStep }) {
  const skillOptions = [
    "Frontend Developer",
    "Backend Developer", 
    "Full Stack Developer",
    "Mobile App Developer",
    "Data Scientist",
    "DevOps Engineer",
    "UI/UX Designer",
    "Product Manager",
    "QA Engineer",
    "Tech Enthusiast",
    "Other"
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center w-full max-w-2xl">
        <div className="mb-12">
          <Image
            src="/logo/techterview_symbol_colored.png"
            alt="TechTerview Logo"
            width={130}
            height={130}
            className="mx-auto"
          />
        </div>
        
        <h1 className="font-playfair font-bold text-5xl text-black mb-6">
          What is your current skill?
        </h1>
        
        <p className="text-2xl text-black max-w-2xl mx-auto mb-12 leading-relaxed">
          Are you a tech enthusiast, web developer, mobile app developer, or just curious?
        </p>
        
        {/* Skill Selection Dropdown */}
        <div className="mb-12">
          <select
            name="skillLevel"
            value={formData.skillLevel}
            onChange={handleInputChange}
            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-gray-500 text-sm appearance-none cursor-pointer"
          >
            <option value="">Select an item</option>
            {skillOptions.map((skill) => (
              <option key={skill} value={skill} className="text-black">
                {skill}
              </option>
            ))}
          </select>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={prevStep}
            variant="outline"
            className="bg-white/10 border border-gray-300 text-black px-8 py-3 rounded-lg text-sm font-medium min-w-[250px] hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button 
            onClick={nextStep}
            className="bg-[#354fd2] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#2a3fa8] transition-colors min-w-[250px]"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Step 5: Experience Level
function Step5({ formData, handleExperienceSelect, nextStep, prevStep }) {
  const experienceLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'expert', label: 'Expert' }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center w-full max-w-4xl">
        <div className="mb-12">
          <Image
            src="/logo/techterview_symbol_colored.png"
            alt="TechTerview Logo"
            width={130}
            height={130}
            className="mx-auto"
          />
        </div>
        
        <h1 className="font-playfair font-bold text-5xl text-black mb-6">
          Have any experience?
        </h1>
        
        <p className="text-2xl text-black max-w-2xl mx-auto mb-12 leading-relaxed">
          We don't judge, any experience level whether you are a pro, intermediate, or beginner.
        </p>
        
        {/* Experience Level Selection Cards */}
        <div className="flex justify-center gap-8 mb-12">
          {experienceLevels.map((level) => (
            <div 
              key={level.value}
              onClick={() => handleExperienceSelect(level.value)}
              className={`cursor-pointer p-8 rounded-xl border-2 transition-all duration-200 w-[270px] h-[139px] flex flex-col items-center justify-center ${
                formData.experienceLevel === level.value 
                  ? 'border-[#354fd2] bg-white' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  formData.experienceLevel === level.value 
                    ? 'border-[#354fd2]' 
                    : 'border-gray-300'
                }`}>
                  {formData.experienceLevel === level.value && (
                    <div className="w-2 h-2 bg-[#354fd2] rounded-full"></div>
                  )}
                </div>
                <UserCheck className={`h-6 w-6 ${formData.experienceLevel === level.value ? 'text-[#354fd2]' : 'text-gray-500'}`} />
              </div>
              <p className={`text-2xl font-medium ${formData.experienceLevel === level.value ? 'text-[#354fd2]' : 'text-[#565656]'}`}>
                {level.label}
              </p>
            </div>
          ))}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={prevStep}
            variant="outline"
            className="bg-white/10 border border-gray-300 text-black px-8 py-3 rounded-lg text-sm font-medium min-w-[250px] hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button 
            onClick={nextStep}
            className="bg-[#354fd2] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#2a3fa8] transition-colors min-w-[250px]"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Step 6: Review
function Step6({ formData, prevStep }) {
  const handleFinish = () => {
    // Handle onboarding completion
    console.log("Onboarding completed with data:", formData);
    // Redirect to dashboard or main app
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center w-full max-w-2xl">
        <div className="mb-12">
          <Image
            src="/logo/techterview_symbol_colored.png"
            alt="TechTerview Logo"
            width={130}
            height={130}
            className="mx-auto"
          />
        </div>
        
        <h1 className="font-playfair font-bold text-5xl text-black mb-6">
          Review
        </h1>
        
        <p className="text-2xl text-black max-w-2xl mx-auto mb-12 leading-relaxed">
          Kindly review all your answers so that we can cater the right tools for you.
        </p>
        
        {/* Review Cards */}
        <div className="space-y-6 mb-12">
          {/* Basic Information Review */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-left">
            <h3 className="text-lg font-semibold text-black mb-4">Basic Information</h3>
            <div className="space-y-2">
              <p className="text-gray-600"><span className="font-medium">Username:</span> {formData.username || "Not provided"}</p>
              <p className="text-gray-600"><span className="font-medium">Full Name:</span> {formData.fullName || "Not provided"}</p>
            </div>
          </div>
          
          {/* Role & Experience Review */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-left">
            <h3 className="text-lg font-semibold text-black mb-4">Role & Experience</h3>
            <div className="space-y-2">
              <p className="text-gray-600"><span className="font-medium">Role:</span> {formData.role === 'candidate' ? 'Candidate' : 'Recruiter'}</p>
              <p className="text-gray-600"><span className="font-medium">Skill:</span> {formData.skillLevel || "Not selected"}</p>
              <p className="text-gray-600"><span className="font-medium">Experience Level:</span> {formData.experienceLevel ? formData.experienceLevel.charAt(0).toUpperCase() + formData.experienceLevel.slice(1) : "Not selected"}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={prevStep}
            variant="outline"
            className="bg-white/10 border border-gray-300 text-black px-8 py-3 rounded-lg text-sm font-medium min-w-[250px] hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button 
            onClick={handleFinish}
            className="bg-[#354fd2] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#2a3fa8] transition-colors min-w-[250px]"
          >
            Complete Onboarding
          </Button>
        </div>
      </div>
    </div>
  );
}