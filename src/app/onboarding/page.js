"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronRight, ChevronLeft, User, UserCheck, IdCard, AlertCircle, Check, X, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { updateUser, getUserByUID, checkUsernameAvailability } from "@/lib/firestore";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    role: "candidate", // candidate or recruiter
    skill: "", // Frontend Development, Backend Development, UI/UX
    experienceLevel: "", // Beginner, Intermediate, Expert
  });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Check authentication and onboarding status
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (authLoading) {
        return; // Still loading auth state
      }

      if (!user) {
        router.push("/auth/login");
        return;
      }

      try {
        // Check if user has completed onboarding
        const userProfile = await getUserByUID(user.uid);

        if (userProfile && userProfile.onboardingCompleted) {
          // User has already completed onboarding, redirect to dashboard
          console.log("User has already completed onboarding, redirecting to dashboard");
          router.push("/dashboard");
          return;
        }

        // User hasn't completed onboarding, allow access to onboarding page
        setCheckingOnboarding(false);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // If there's an error, assume they need onboarding
        setCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [user, authLoading, router]);

  // Username validation function
  const validateUsername = async (username) => {
    if (!username || username.trim() === "") {
      setUsernameError("");
      return true; // Empty username will be caught by required field validation
    }

    // Check username length and format
    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters long.");
      return false;
    }

    if (username.length > 20) {
      setUsernameError("Username must be 20 characters or less.");
      return false;
    }

    // Check for valid characters (alphanumeric and underscore only)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError("Username can only contain letters, numbers, and underscores.");
      return false;
    }

    setCheckingUsername(true);
    try {
      const result = await checkUsernameAvailability(username, user?.uid);
      if (!result.available) {
        setUsernameError("This username is already taken. Please choose a different one.");
        return false;
      }
      setUsernameError("");
      return true;
    } catch (error) {
      console.error("Error checking username availability:", error);
      setUsernameError("Unable to verify username availability. Please try again.");
      return false;
    } finally {
      setCheckingUsername(false);
    }
  };

  // Validation function to check if all required fields are filled
  const isFormValid = () => {
    const isBasicValid =
      formData.username.trim() !== "" &&
      formData.fullName.trim() !== "" &&
      formData.role !== "" &&
      usernameError === "" &&
      !checkingUsername;

    if (formData.role === 'recruiter') {
      return isBasicValid;
    }

    return (
      isBasicValid &&
      formData.skill !== "" &&
      formData.experienceLevel !== ""
    );
  };

  // Step-specific validation functions
  const isStep2Valid = () => {
    return formData.username.trim() !== "" && formData.fullName.trim() !== "" && usernameError === "";
  };

  const isStep3Valid = () => {
    return formData.role !== "";
  };

  const isStep4Valid = () => {
    return formData.skill !== "";
  };

  const isStep5Valid = () => {
    return formData.experienceLevel !== "";
  };

  // Show loading while checking authentication and onboarding status
  if (authLoading || checkingOnboarding) {
    return (
      <div className="min-h-screen bg-[#f0f7ff] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <Image
              src="/logo/techterview_symbol_colored.png"
              alt="TechTerview Logo"
              width={80}
              height={80}
              className="mx-auto"
            />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError("");
    }

    // Validate username on change with debounce
    if (name === 'username') {
      setUsernameError(""); // Clear previous error immediately
      // Debounce username validation
      if (window.usernameValidationTimeout) {
        clearTimeout(window.usernameValidationTimeout);
      }
      window.usernameValidationTimeout = setTimeout(() => {
        validateUsername(value);
      }, 500); // Wait 500ms after user stops typing
    }
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      role: role
    }));
    // Clear validation error when user selects role
    if (validationError) {
      setValidationError("");
    }
  };

  const handleExperienceSelect = (level) => {
    setFormData(prev => ({
      ...prev,
      experienceLevel: level
    }));
    // Clear validation error when user selects experience level
    if (validationError) {
      setValidationError("");
    }
  };

  const nextStep = async () => {
    // Clear any existing validation errors
    setValidationError("");

    // Validate current step before proceeding
    if (currentStep === 2) {
      // Check if basic fields are filled
      if (formData.username.trim() === "" || formData.fullName.trim() === "") {
        setValidationError("Please fill in both username and full name.");
        return;
      }

      // Validate username format and availability
      const isUsernameValid = await validateUsername(formData.username);
      if (!isUsernameValid) {
        setValidationError("Please fix the username issue before proceeding.");
        return;
      }
    }
    if (currentStep === 3) {
      if (!isStep3Valid()) {
        setValidationError("Please select your role.");
        return;
      }
      if (formData.role === 'recruiter') {
        setCurrentStep(6);
        return;
      }
    }
    if (currentStep === 4 && !isStep4Valid()) {
      setValidationError("Please select your skill area.");
      return;
    }
    if (currentStep === 5 && !isStep5Valid()) {
      setValidationError("Please select your experience level.");
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      // If recruiter going back from review (step 6), go back to role selection (step 3)
      if (currentStep === 6 && formData.role === 'recruiter') {
        setCurrentStep(3);
        return;
      }
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
        return <Step2 formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} validationError={validationError} usernameError={usernameError} checkingUsername={checkingUsername} />;
      case 3:
        return <Step3 formData={formData} handleRoleSelect={handleRoleSelect} nextStep={nextStep} prevStep={prevStep} validationError={validationError} />;
      case 4:
        return <Step4 formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} validationError={validationError} />;
      case 5:
        return <Step5 formData={formData} handleExperienceSelect={handleExperienceSelect} nextStep={nextStep} prevStep={prevStep} validationError={validationError} />;
      case 6:
        return <Step6 formData={formData} prevStep={prevStep} user={user} router={router} loading={loading} setLoading={setLoading} isFormValid={isFormValid} />;
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
function Step2({ formData, handleInputChange, nextStep, prevStep, validationError, usernameError, checkingUsername }) {
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
                className={`pl-12 pr-10 h-12 w-full bg-white border rounded-lg ${usernameError ? 'border-red-300 focus:border-red-500' :
                  formData.username && !usernameError && !checkingUsername ? 'border-green-300 focus:border-green-500' :
                    'border-gray-200'
                  }`}
              />
              {/* Username validation indicator */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {checkingUsername && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                )}
                {!checkingUsername && formData.username && !usernameError && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                {!checkingUsername && usernameError && (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>

            {/* Username validation message */}
            {usernameError && (
              <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>{usernameError}</span>
              </div>
            )}
            {!usernameError && formData.username && !checkingUsername && formData.username.length >= 3 && (
              <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                <Check className="h-3 w-3" />
                <span>Username is available!</span>
              </div>
            )}
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

        {/* Validation Error Alert */}
        {validationError && (
          <div className="mb-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {validationError}
              </AlertDescription>
            </Alert>
          </div>
        )}

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
function Step3({ formData, handleRoleSelect, nextStep, prevStep, validationError }) {
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
            className={`cursor-pointer p-8 rounded-xl border-2 transition-all duration-200 w-[270px] h-[139px] flex flex-col items-center justify-center ${formData.role === 'recruiter'
              ? 'border-[#354fd2] bg-white'
              : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
          >
            <div className="flex items-center gap-4 mb-2">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.role === 'recruiter'
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
            className={`cursor-pointer p-8 rounded-xl border-2 transition-all duration-200 w-[270px] h-[139px] flex flex-col items-center justify-center ${formData.role === 'candidate'
              ? 'border-[#354fd2] bg-white'
              : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
          >
            <div className="flex items-center gap-4 mb-2">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.role === 'candidate'
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

        {/* Validation Error Alert */}
        {validationError && (
          <div className="mb-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {validationError}
              </AlertDescription>
            </Alert>
          </div>
        )}

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
function Step4({ formData, handleInputChange, nextStep, prevStep, validationError }) {
  const skillOptions = [
    "Frontend Development",
    "Backend Development",
    "UI/UX"
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
          What is your skill area?
        </h1>

        <p className="text-2xl text-black max-w-2xl mx-auto mb-12 leading-relaxed">
          Which area of technology interests you the most?
        </p>

        {/* Skill Selection Dropdown */}
        <div className="mb-12">
          <select
            name="skill"
            value={formData.skill}
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

        {/* Validation Error Alert */}
        {validationError && (
          <div className="mb-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {validationError}
              </AlertDescription>
            </Alert>
          </div>
        )}

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
function Step5({ formData, handleExperienceSelect, nextStep, prevStep, validationError }) {
  const experienceLevels = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Expert', label: 'Expert' }
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
              className={`cursor-pointer p-8 rounded-xl border-2 transition-all duration-200 w-[270px] h-[139px] flex flex-col items-center justify-center ${formData.experienceLevel === level.value
                ? 'border-[#354fd2] bg-white'
                : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.experienceLevel === level.value
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

        {/* Validation Error Alert */}
        {validationError && (
          <div className="mb-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {validationError}
              </AlertDescription>
            </Alert>
          </div>
        )}

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
function Step6({ formData, prevStep, user, router, loading, setLoading, isFormValid }) {
  const handleFinish = async () => {
    if (!user) return;

    // Validate all fields before proceeding
    if (!isFormValid()) {
      // The button should already be disabled, but this is a safety check
      console.warn("Attempted to submit incomplete form");
      return;
    }

    setLoading(true);
    try {
      // Update user profile with onboarding data
      await updateUser(user.uid, {
        username: formData.username,
        displayName: formData.fullName,
        role: formData.role,
        skill: formData.skill,
        experienceLevel: formData.experienceLevel,
        profileComplete: true,
        onboardingCompleted: true
      });

      console.log("Onboarding completed successfully!");
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      // Could show a toast notification here instead of alert
      // For now, just log the error - the user will see the loading state end
    } finally {
      setLoading(false);
    }
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
              <p className={`${formData.username.trim() === "" ? "text-red-600" : "text-gray-600"}`}>
                <span className="font-medium">Username:</span> {formData.username || "Not provided"}
                {formData.username.trim() === "" && <span className="text-red-500 ml-2">*Required</span>}
              </p>
              <p className={`${formData.fullName.trim() === "" ? "text-red-600" : "text-gray-600"}`}>
                <span className="font-medium">Full Name:</span> {formData.fullName || "Not provided"}
                {formData.fullName.trim() === "" && <span className="text-red-500 ml-2">*Required</span>}
              </p>
            </div>
          </div>

          {/* Role & Experience Review */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-left">
            <h3 className="text-lg font-semibold text-black mb-4">Role & Experience</h3>
            <div className="space-y-2">
              <p className={`${formData.role === "" ? "text-red-600" : "text-gray-600"}`}>
                <span className="font-medium">Role:</span> {formData.role === 'candidate' ? 'Candidate' : formData.role === 'recruiter' ? 'Recruiter' : 'Not selected'}
                {formData.role === "" && <span className="text-red-500 ml-2">*Required</span>}
              </p>

              {formData.role === 'candidate' && (
                <>
                  <p className={`${formData.skill === "" ? "text-red-600" : "text-gray-600"}`}>
                    <span className="font-medium">Skill:</span> {formData.skill || "Not selected"}
                    {formData.skill === "" && <span className="text-red-500 ml-2">*Required</span>}
                  </p>
                  <p className={`${formData.experienceLevel === "" ? "text-red-600" : "text-gray-600"}`}>
                    <span className="font-medium">Experience Level:</span> {formData.experienceLevel || "Not selected"}
                    {formData.experienceLevel === "" && <span className="text-red-500 ml-2">*Required</span>}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Validation Message */}
        {!isFormValid() && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-700 text-sm font-medium">
              Please complete all required fields marked with * before finishing onboarding.
            </p>
          </div>
        )}

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
            disabled={loading || !isFormValid()}
            className="bg-[#354fd2] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#2a3fa8] transition-colors min-w-[250px] disabled:opacity-50"
          >
            {loading ? "Saving..." : "Complete Onboarding"}
          </Button>
        </div>
      </div>
    </div>
  );
}