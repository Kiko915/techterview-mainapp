"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { getUserByUID, updateUser, checkUsernameAvailability } from "@/lib/firestore";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { emitProfileUpdate } from "@/lib/profileEvents";
import AccountSidebar from "./components/AccountSidebar";
import PersonalInfoTab from "./components/PersonalInfoTab";
import SecurityTab from "./components/SecurityTab";
import AchievementsTab from "./components/AchievementsTab";

export default function AccountPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);

  // Edit Profile Dialog States
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    displayName: '',
    username: '',
    country: '',
    address: '',
    skill: '',
    experienceLevel: ''
  });
  const [usernameError, setUsernameError] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Password States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profile = await getUserByUID(user.uid);
          setUserProfile(profile);
          setEditFormData({
            displayName: profile?.displayName || '',
            username: profile?.username || '',
            country: profile?.country || '',
            address: profile?.address || '',
            skill: profile?.skill || '',
            experienceLevel: profile?.experienceLevel || ''
          });
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  // Fetch countries data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
        const data = await response.json();
        const sortedCountries = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!user?.uid || !user?.email) {
      toast.error("User not authenticated. Please try again.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long!");
      return;
    }

    // Check password strength
    const hasLowercase = /[a-z]/.test(passwordData.newPassword);
    const hasUppercase = /[A-Z]/.test(passwordData.newPassword);
    const hasNumbers = /\d/.test(passwordData.newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword);

    if (!hasLowercase || !hasUppercase || !hasNumbers) {
      toast.error("Password must contain at least one lowercase letter, one uppercase letter, and one number!");
      return;
    }

    setPasswordLoading(true);
    try {
      // Reauthenticate user first
      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, passwordData.newPassword);

      toast.success("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.code === 'auth/wrong-password') {
        toast.error("Current password is incorrect.");
      } else if (error.code === 'auth/weak-password') {
        toast.error("The password is too weak. Please choose a stronger password.");
      } else if (error.code === 'auth/requires-recent-login') {
        toast.error("For security reasons, please log out and log back in before changing your password.");
      } else if (error.code === 'auth/user-mismatch') {
        toast.error("Authentication error. Please try logging out and back in.");
      } else {
        toast.error(`Failed to update password: ${error.message || 'Please try again.'}`);
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear username error when user starts typing
    if (field === 'username') {
      setUsernameError('');
    }
  };

  // Debounced username validation
  const validateUsername = async (username) => {
    if (!username || username === userProfile?.username || !user?.uid) {
      setUsernameError('');
      return true;
    }

    setCheckingUsername(true);
    try {
      const result = await checkUsernameAvailability(username, user.uid);
      if (!result.available) {
        setUsernameError('This username is already taken');
        return false;
      } else {
        setUsernameError('');
        return true;
      }
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameError('Error validating username');
      return false;
    } finally {
      setCheckingUsername(false);
    }
  };

  // Debounce username validation
  useEffect(() => {
    if (editFormData.username && editFormData.username !== userProfile?.username && user?.uid) {
      const timeoutId = setTimeout(() => {
        validateUsername(editFormData.username);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [editFormData.username, userProfile?.username, user?.uid]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      toast.error("User not authenticated. Please try again.");
      return;
    }

    if (!editFormData.displayName.trim() || !editFormData.username.trim()) {
      toast.error("Display name and username are required!");
      return;
    }

    // Check if there's a username error
    if (usernameError) {
      toast.error("Please fix the username error before submitting.");
      return;
    }

    // Final username validation if it's different from current
    if (editFormData.username !== userProfile?.username) {
      const isValid = await validateUsername(editFormData.username);
      if (!isValid) {
        toast.error("Username is not available. Please choose a different one.");
        return;
      }
    }

    setEditLoading(true);
    try {
      await updateUser(user.uid, {
        displayName: editFormData.displayName,
        username: editFormData.username.toLowerCase(),
        country: editFormData.country,
        address: editFormData.address,
        skill: editFormData.skill,
        experienceLevel: editFormData.experienceLevel
      });

      // Refresh user profile
      const updatedProfile = await getUserByUID(user.uid);
      setUserProfile(updatedProfile);
      setEditDialogOpen(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const getUserInitials = () => {
    if (userProfile?.displayName) {
      return userProfile.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const getSelectedCountryFlag = () => {
    const selectedCountry = countries.find(c => c.name.common === editFormData.country);
    return selectedCountry?.flags?.svg || null;
  };

  const handleImageUpdate = async (newImageUrl) => {
    // Update the local user profile state
    const updatedProfile = {
      ...userProfile,
      photoURL: newImageUrl
    };
    setUserProfile(updatedProfile);

    // Emit profile update event for other components (like TopNavbar)
    emitProfileUpdate(updatedProfile);

    // Optionally refetch the user profile to ensure consistency
    if (user?.uid) {
      try {
        const freshProfile = await getUserByUID(user.uid);
        setUserProfile(freshProfile);
        emitProfileUpdate(freshProfile);
      } catch (error) {
        console.error('Error refreshing user profile:', error);
      }
    }
  };

  // Sample achievements data
  const achievements = [
    {
      emoji: "🥇",
      title: "First Login",
      description: "Welcome to TechTerview!",
      earned: true
    },
    {
      emoji: "💻",
      title: "Profile Completed",
      description: "You've filled out your personal info.",
      earned: userProfile?.profileComplete || false
    },
    {
      emoji: "🎯",
      title: "First Mock Interview",
      description: "You've taken your first challenge.",
      earned: true
    },
    {
      emoji: "🔥",
      title: "3-Day Streak",
      description: "You've been active for 3 consecutive days.",
      earned: false
    },
    {
      emoji: "🚀",
      title: "Explorer",
      description: "You tried a coding test for the first time.",
      earned: true
    }
  ];

  // Let Next.js loading.js handle initial route loading

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <AccountSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userRole={userProfile?.role}
        />

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'personal' && (
            <PersonalInfoTab
              user={user}
              userProfile={userProfile}
              formatDate={formatDate}
              getUserInitials={getUserInitials}
              editDialogOpen={editDialogOpen}
              setEditDialogOpen={setEditDialogOpen}
              editFormData={editFormData}
              handleEditFormChange={handleEditFormChange}
              usernameError={usernameError}
              checkingUsername={checkingUsername}
              countries={countries}
              getSelectedCountryFlag={getSelectedCountryFlag}
              handleEditSubmit={handleEditSubmit}
              editLoading={editLoading}
              onImageUpdate={handleImageUpdate}
            />
          )}

          {activeTab === 'security' && (
            <SecurityTab
              showCurrentPassword={showCurrentPassword}
              setShowCurrentPassword={setShowCurrentPassword}
              showNewPassword={showNewPassword}
              setShowNewPassword={setShowNewPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              passwordData={passwordData}
              handlePasswordChange={handlePasswordChange}
              handlePasswordUpdate={handlePasswordUpdate}
              passwordLoading={passwordLoading}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsTab
              achievements={achievements}
            />
          )}
        </div>
      </div>
    </div>
  );
}