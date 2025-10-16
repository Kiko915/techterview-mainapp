"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/lib/useAuth";
import { getUserByUID } from "@/lib/firestore";
import { onProfileUpdate, offProfileUpdate } from "@/lib/profileEvents";
import { logOut } from "@/lib/firebase";
import { subscribeToUserNotifications, markNotificationAsRead } from "@/lib/notifications";
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
  Check,
  X,
  Star,
  Info,
  AlertCircle,
  CheckCircle,
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
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: Bell,
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
  const router = useRouter();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);

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

  // Listen for profile updates from other components
  useEffect(() => {
    const handleProfileUpdate = (updatedProfile) => {
      if (updatedProfile && user && updatedProfile.uid === user.uid) {
        setUserProfile(updatedProfile);
      }
    };

    onProfileUpdate(handleProfileUpdate);
    
    return () => {
      offProfileUpdate(handleProfileUpdate);
    };
  }, [user]);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToUserNotifications(
      user.uid,
      (userNotifications) => {
        setNotifications(userNotifications);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.uid]);

  const handleLogout = async () => {
    try {
      await logOut();
      // User will be automatically redirected by AuthGuard
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Handle marking notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'welcome':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  // Format notification time
  const formatNotificationTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
    if (pathname === '/dashboard/notifications') return 'Notifications';
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#354fd2] text-[10px] font-medium text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-0" align="end" side="bottom">
            <div className="border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge className="bg-[#354fd2] text-white hover:bg-[#354fd2]">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto p-4">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No notifications yet</p>
                  <p className="text-xs text-gray-400 mt-1">We'll notify you when something important happens</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`p-4 focus:bg-gray-50 cursor-pointer ${
                        !notification.isRead ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 rounded-full bg-[#354fd2] flex-shrink-0 ml-2"></div>
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${
                            !notification.isRead ? 'text-gray-700' : 'text-gray-500'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatNotificationTime(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="border-t border-gray-200 p-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-[#354fd2] hover:bg-[#354fd2] hover:text-white text-xs font-medium"
                  onClick={() => {
                    router.push('/dashboard/notifications');
                  }}
                >
                  View all notifications
                </Button>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

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
                <AvatarImage src={userProfile?.photoURL || user?.photoURL} alt={userName} />
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
