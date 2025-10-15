"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/lib/useAuth";
import { getUserByUID } from "@/lib/firestore";
import { logOut } from "@/lib/firebase";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Version } from "@/components/ui/version";
import {
  BarChart3,
  Code,
  Video,
  Bot,
  Map,
  TrendingUp,
  Settings,
  Bell,
  HelpCircle,
  User,
  LogOut,
} from "lucide-react";

// Navigation items for the sidebar
const navItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Coding Challenge",
    url: "/dashboard/coding-challenge",
    icon: Code,
  },
  {
    title: "Mock Interviews",
    url: "/dashboard/mock-interviews",
    icon: Video,
  },
  {
    title: "AI Mentor",
    url: "/dashboard/ai-mentor",
    icon: Bot,
  },
  {
    title: "Learning Path",
    url: "/dashboard/learning-path",
    icon: Map,
  },
  {
    title: "Progress",
    url: "/dashboard/progress",
    icon: TrendingUp,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 bg-white">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-center">
          {isCollapsed ? (
            <Image
              src="/logo/techterview_symbol_colored.png"
              alt="TechTerview"
              width={32}
              height={32}
              className="object-contain"
            />
          ) : (
            <Image
              src="/logo/techterview_wordmark_colored.png"
              alt="TechTerview"
              width={140}
              height={26}
              className="object-contain"
            />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`${
                        isActive 
                          ? 'bg-[#354fd2] text-white hover:bg-[#2a3fa8]' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      } transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''}`}
                      tooltip={isCollapsed ? item.title : undefined}
                    >
                      <Link 
                        href={item.url} 
                        className={`flex items-center ${
                          isCollapsed ? 'justify-center w-full' : 'gap-3'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && (
                          <span className="font-medium">{item.title}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex justify-center">
          {!isCollapsed && <Version className="text-gray-500" />}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function TopNavbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profile = await getUserByUID(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logOut();
      // User will be automatically redirected by AuthGuard
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const userName = userProfile?.displayName || userProfile?.username || user?.email?.split('@')[0] || 'User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  
  // Function to get page title based on current path
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Overview';
    if (pathname === '/dashboard/coding-challenge') return 'Coding Challenge';
    if (pathname === '/dashboard/mock-interviews') return 'Mock Interviews';
    if (pathname === '/dashboard/ai-mentor') return 'AI Mentor';
    if (pathname === '/dashboard/learning-path') return 'Learning Path';
    if (pathname === '/dashboard/progress') return 'Progress';
    if (pathname === '/dashboard/settings') return 'Settings';
    if (pathname === '/dashboard/account') return 'My Account';
    
    // Fallback for any other dashboard routes
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length > 1) {
      return pathSegments[pathSegments.length - 1]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    return 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Left side - Sidebar trigger */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
        <h1 className="text-lg font-semibold text-foreground">{getPageTitle()}</h1>
      </div>

      {/* Right side - Navigation items */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          {/* Notification badge */}
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
            3
          </span>
        </Button>

        {/* Help */}
        <Button 
          asChild
          size="sm" 
          className="bg-[#354fd2] text-white hover:bg-[#2a3fa8] transition-colors"
        >
          <Link href="/help">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </Link>
        </Button>

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL} alt={userName} />
                <AvatarFallback className="bg-[#354fd2] text-white text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{userName}</p>
                  {userProfile?.role && (userProfile.role === 'candidate' || userProfile.role === 'recruiter') && (
                    <Badge 
                      variant={userProfile.role === 'candidate' ? 'default' : 'secondary'}
                      className="text-xs capitalize"
                    >
                      {userProfile.role}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/account" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>My Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4 text-red-400" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard requireOnboarding={true}>
      <SidebarProvider className="min-h-screen">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <TopNavbar />
          <main className="flex-1 overflow-auto bg-background p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
