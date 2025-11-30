"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Lock, Award, ScrollText } from "lucide-react";
import Link from "next/link";

export default function AccountSidebar({ activeTab, setActiveTab }) {
  return (
    <Card className="lg:col-span-1 h-fit">
      <CardContent className="p-4">
        <nav className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => setActiveTab('personal')}
            className={`w-full justify-start ${activeTab === 'personal'
                ? 'bg-[#354fd2] text-white hover:bg-[#2a3fa8]'
                : 'hover:bg-gray-100'
              }`}
          >
            <User className="h-4 w-4 mr-2" />
            Personal Information
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab('security')}
            className={`w-full justify-start ${activeTab === 'security'
                ? 'bg-[#354fd2] text-white hover:bg-[#2a3fa8]'
                : 'hover:bg-gray-100'
              }`}
          >
            <Lock className="h-4 w-4 mr-2" />
            Security Settings
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab('achievements')}
            className={`w-full justify-start ${activeTab === 'achievements'
                ? 'bg-[#354fd2] text-white hover:bg-[#2a3fa8]'
                : 'hover:bg-gray-100'
              }`}
          >
            <Award className="h-4 w-4 mr-2" />
            Achievements
          </Button>

          <div className="pt-2 mt-2 border-t border-gray-100">
            <Link href="/dashboard/certificates" className="w-full block">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-gray-100 text-slate-600"
              >
                <ScrollText className="h-4 w-4 mr-2" />
                My Certificates
              </Button>
            </Link>
          </div>
        </nav>
      </CardContent>
    </Card>
  );
}