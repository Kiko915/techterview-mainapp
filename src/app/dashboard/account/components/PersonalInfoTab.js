"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import ProfilePicture from "./ProfilePicture";
import ProfileFields from "./ProfileFields";
import EditProfileDialog from "./EditProfileDialog";

export default function PersonalInfoTab({ 
  user,
  userProfile,
  formatDate,
  getUserInitials,
  editDialogOpen,
  setEditDialogOpen,
  editFormData,
  handleEditFormChange,
  usernameError,
  checkingUsername,
  countries,
  getSelectedCountryFlag,
  handleEditSubmit,
  editLoading
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-6">
        <ProfilePicture 
          user={user}
          getUserInitials={getUserInitials}
        />
        
        <Separator />
        
        <ProfileFields 
          user={user}
          userProfile={userProfile}
          formatDate={formatDate}
        />
        
        <Separator />
        
        <div className="flex justify-start">
          <EditProfileDialog
            editDialogOpen={editDialogOpen}
            setEditDialogOpen={setEditDialogOpen}
            editFormData={editFormData}
            handleEditFormChange={handleEditFormChange}
            usernameError={usernameError}
            checkingUsername={checkingUsername}
            userProfile={userProfile}
            countries={countries}
            getSelectedCountryFlag={getSelectedCountryFlag}
            handleEditSubmit={handleEditSubmit}
            editLoading={editLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}