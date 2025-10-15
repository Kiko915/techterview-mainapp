"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Lock, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from "lucide-react";

// Password strength calculator
const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, text: '', color: '' };
  
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  Object.values(checks).forEach(check => {
    if (check) score++;
  });
  
  if (score <= 2) {
    return { score: (score / 5) * 100, text: 'Weak', color: 'bg-red-500', checks };
  } else if (score <= 3) {
    return { score: (score / 5) * 100, text: 'Fair', color: 'bg-yellow-500', checks };
  } else if (score <= 4) {
    return { score: (score / 5) * 100, text: 'Good', color: 'bg-blue-500', checks };
  } else {
    return { score: 100, text: 'Strong', color: 'bg-green-500', checks };
  }
};

export default function SecurityTab({
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  passwordData,
  handlePasswordChange,
  handlePasswordUpdate,
  passwordLoading
}) {
  const passwordStrength = calculatePasswordStrength(passwordData.newPassword);
  const passwordsMatch = passwordData.newPassword === passwordData.confirmPassword && passwordData.confirmPassword !== '';
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Security Settings
        </CardTitle>
        <CardDescription>
          Change your password to keep your account secure
        </CardDescription>
        <Separator />
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Current Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="pl-10 pr-10"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {/* Password Match Indicator */}
            {passwordData.confirmPassword && (
              <div className={`flex items-center gap-2 text-xs ${
                passwordsMatch ? 'text-green-600' : 'text-red-600'
              }`}>
                {passwordsMatch ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    Passwords match
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3" />
                    Passwords do not match
                  </>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="pl-10 pr-10"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {passwordData.newPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Password Strength:</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength.text === 'Weak' ? 'text-red-600' :
                    passwordStrength.text === 'Fair' ? 'text-yellow-600' :
                    passwordStrength.text === 'Good' ? 'text-blue-600' :
                    'text-green-600'
                  }`}>{passwordStrength.text}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.score}%` }}
                  ></div>
                </div>
                
                {/* Password Requirements */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center gap-1 ${
                    passwordStrength.checks.length ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {passwordStrength.checks.length ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    8+ characters
                  </div>
                  <div className={`flex items-center gap-1 ${
                    passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {passwordStrength.checks.lowercase ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    Lowercase
                  </div>
                  <div className={`flex items-center gap-1 ${
                    passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {passwordStrength.checks.uppercase ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    Uppercase
                  </div>
                  <div className={`flex items-center gap-1 ${
                    passwordStrength.checks.numbers ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {passwordStrength.checks.numbers ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    Numbers
                  </div>
                  <div className={`flex items-center gap-1 ${
                    passwordStrength.checks.special ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {passwordStrength.checks.special ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    Special chars
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Confirm New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="pl-10 pr-10"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="bg-[#354fd2] hover:bg-[#2a3fa8]"
            disabled={passwordLoading}
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
        
        <Separator className="my-6" />
        
        {/* Security Tips */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Shield className="h-4 w-4" />
            Security Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Use a unique password you don't use anywhere else</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Include a mix of letters, numbers, and special characters</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Make it at least 8 characters long</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Avoid using personal information like birthdays</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}