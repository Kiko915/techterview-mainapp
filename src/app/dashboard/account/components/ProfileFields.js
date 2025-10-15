"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AtSign, Mail, User, Calendar, Flag, MapPin } from "lucide-react";

export default function ProfileFields({ user, userProfile, formatDate }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Display Name
        </Label>
        <Input 
          value={userProfile?.displayName || ''} 
          readOnly 
          className="bg-gray-50"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Username
        </Label>
        <div className="relative">
          <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            value={userProfile?.username || ''} 
            className="pl-10 bg-gray-50"
            readOnly
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            value={user?.email || ''} 
            className="pl-10 bg-gray-100"
            type="email"
            readOnly
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Role
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            value={userProfile?.role ? userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1) : ''} 
            className="pl-10 bg-gray-100"
            readOnly
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Joined Date
        </Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            value={formatDate(userProfile?.createdAt)} 
            className="pl-10 bg-gray-100"
            readOnly
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Country
        </Label>
        <div className="relative">
          <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            value={userProfile?.country || 'Not specified'} 
            className="pl-10 bg-gray-50"
            readOnly
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Address
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            value={userProfile?.address || 'Not specified'} 
            className="pl-10 bg-gray-50"
            readOnly
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Skill
        </Label>
        <Input 
          value={userProfile?.skill || 'Not specified'}
          className="bg-gray-50"
          readOnly
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Experience Level
        </Label>
        <Input 
          value={userProfile?.experienceLevel || 'Not specified'} 
          className="bg-gray-50"
          readOnly
        />
      </div>
    </div>
  );
}