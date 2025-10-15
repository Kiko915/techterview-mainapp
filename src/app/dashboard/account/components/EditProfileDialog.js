"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Save, X } from "lucide-react";

export default function EditProfileDialog({ 
  editDialogOpen, 
  setEditDialogOpen,
  editFormData,
  handleEditFormChange,
  usernameError,
  checkingUsername,
  userProfile,
  countries,
  getSelectedCountryFlag,
  handleEditSubmit,
  editLoading 
}) {
  return (
    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#354fd2] hover:bg-[#2a3fa8]">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information. Email, role, and joined date cannot be changed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="displayName" className="text-right">
                Display Name
              </Label>
              <Input
                id="displayName"
                value={editFormData.displayName}
                onChange={(e) => handleEditFormChange('displayName', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <div className="col-span-3 space-y-1">
                <div className="relative">
                  <Input
                    id="username"
                    value={editFormData.username}
                    onChange={(e) => handleEditFormChange('username', e.target.value)}
                    className={usernameError ? 'border-red-500' : ''}
                    required
                  />
                  {checkingUsername && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                {usernameError && (
                  <p className="text-sm text-red-500">{usernameError}</p>
                )}
                {!usernameError && editFormData.username && editFormData.username !== userProfile?.username && !checkingUsername && (
                  <p className="text-sm text-green-500">✓ Username is available</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">
                Country
              </Label>
              <Select 
                value={editFormData.country} 
                onValueChange={(value) => handleEditFormChange('country', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a country">
                    {editFormData.country && (
                      <div className="flex items-center gap-2">
                        {getSelectedCountryFlag() && (
                          <img 
                            src={getSelectedCountryFlag()} 
                            alt="Flag" 
                            className="w-4 h-3 object-cover rounded-sm"
                          />
                        )}
                        {editFormData.country}
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.name.common} value={country.name.common}>
                      <div className="flex items-center gap-2">
                        <img 
                          src={country.flags.svg} 
                          alt={`${country.name.common} flag`} 
                          className="w-4 h-3 object-cover rounded-sm"
                        />
                        {country.name.common}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                value={editFormData.address}
                onChange={(e) => handleEditFormChange('address', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skill" className="text-right">
                Skill
              </Label>
              <Select 
                value={editFormData.skill} 
                onValueChange={(value) => handleEditFormChange('skill', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                  <SelectItem value="Backend Development">Backend Development</SelectItem>
                  <SelectItem value="UI/UX">UI/UX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="experienceLevel" className="text-right">
                Experience Level
              </Label>
              <Select 
                value={editFormData.experienceLevel} 
                onValueChange={(value) => handleEditFormChange('experienceLevel', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
              disabled={editLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={editLoading || checkingUsername || usernameError}
              className="bg-[#354fd2] hover:bg-[#2a3fa8]"
            >
              <Save className="h-4 w-4 mr-2" />
              {editLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}