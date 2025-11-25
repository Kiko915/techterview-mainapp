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
import { EnrollmentProvider } from "@/contexts/EnrollmentContext";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
  Home,
  BookOpen,
  Target,
  Brain,
} from "lucide-react";

// Navigation sections for the sidebar
const navSections = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: Home,
        description: "Your main dashboard"
      },
    ]
  },
  {
    title: "Practice & Learning",
    items: [
      {
        title: "Coding Challenge",
        url: "/dashboard/coding-challenge",
        icon: Code,
        description: "Solve coding problems"
      },
      {
        title: "Mock Interviews",
        url: "/dashboard/mock-interviews",
        icon: Video,
        description: "Practice interviews"
      },
      {
        title: "AI Mentor",
        url: "/dashboard/ai-mentor",
        icon: Brain,
        description: "Get AI guidance"
      },
      {
        title: "Interview Tracks",
        url: "/dashboard/interview-tracks",
        icon: Map,
        description: "Your interview preparation tracks"
      },
    ]
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Progress",
        url: "/dashboard/progress",
        icon: TrendingUp,
        description: "Track your improvement"
      },
    ]
  },
  {
    title: "Account",
    items: [
      {
        title: "Notifications",
        url: "/dashboard/notifications",
        icon: Bell,
        description: "Your notifications"
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
        description: "Account settings"
      },
    ]
  },
];

function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 bg-gradient-to-b from-gray-50 to-white">
      <SidebarHeader className={`${isCollapsed ? 'p-2' : 'p-4'} border-b border-gray-100`}>
        <div className="flex items-center justify-center">
          {isCollapsed ? (
            <div className="w-10 h-10  flex items-center justify-center">
              <Image
                src="/logo/techterview_symbol_colored.png"
                alt="TechTerview"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Image
                src="/logo/techterview_wordmark_colored.png"
                alt="TechTerview"
                width={120}
                height={22}
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'block';
                }}
              />
              <div className="hidden text-xl font-bold text-[#354fd2]" style={{ display: 'none' }}>
                TechTerview
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className={`${isCollapsed ? 'px-0 py-3' : 'px-3 py-4'}`}>
        {navSections.map((section, sectionIndex) => (
          <SidebarGroup key={section.title} className={sectionIndex > 0 ? (isCollapsed ? 'mt-3' : 'mt-4') : ''}>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 mb-2">
                {section.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className={`${isCollapsed ? 'space-y-2' : 'space-y-1'}`}>
                {section.items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title} className={isCollapsed ? 'flex justify-center' : ''}>
                      <SidebarMenuButton
                        asChild
                        className={`${isActive
                          ? 'bg-[#354fd2] text-white hover:bg-[#2a3fa8] shadow-sm'
                          : 'text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                          } transition-all duration-200 rounded-lg ${isCollapsed
                            ? 'w-[44px] h-[44px] p-0 flex justify-center items-center'
                            : 'mx-1 px-4 py-6 w-full'
                          } group relative`}
                        tooltip={isCollapsed ? `${item.title} - ${item.description}` : undefined}
                      >
                        <Link
                          href={item.url}
                          className={`flex items-center ${isCollapsed ? 'w-[44px] h-[44px] justify-center' : 'w-full gap-4 justify-start'
                            }`}
                        >
                          <item.icon className={`${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'
                            } flex-shrink-0`} />
                          {!isCollapsed && (
                            <div className="flex flex-col flex-1 min-w-0 py-1">
                              <span className="font-medium text-sm truncate leading-5">
                                {item.title}
                              </span>
                              <span className={`text-xs truncate leading-4 mt-0.5 ${isActive ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                {item.description}
                              </span>
                            </div>
                          )}
                          {!isCollapsed && isActive && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white/80 flex-shrink-0"></div>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            {!isCollapsed && sectionIndex < navSections.length - 1 && (
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-3 mt-3"></div>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className={`${isCollapsed ? 'p-2' : 'p-4'} border-t border-gray-100 bg-white/50`}>
        <div className="flex justify-center">
          {!isCollapsed && (
            <div className="text-center">
              <Version className="text-gray-400 text-xs" />
              <p className="text-xs text-gray-400 mt-1">TechTerview Dashboard</p>
            </div>
          )}
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
    if (pathname === '/dashboard/interview-tracks') return 'Interview Tracks';
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
                      className={`p-4 focus:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50/30' : ''
                        }`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 rounded-full bg-[#354fd2] flex-shrink-0 ml-2"></div>
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${!notification.isRead ? 'text-gray-700' : 'text-gray-500'
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
  const pathname = usePathname();
  // Check if the current page should be full screen (no padding, hidden overflow)
  // This applies to lesson pages and specific coding challenge pages (not the lobby)
  const isFullScreenPage =
    pathname?.includes('/lesson/') ||
    (pathname?.includes('/coding-challenge/') && pathname.split('/').length > 3) ||
    pathname?.includes('/dashboard/ai-mentor');

  return (
    <AuthGuard requireOnboarding={true}>
      <EnrollmentProvider>
        <SidebarProvider className={`min-h-screen ${isFullScreenPage ? 'h-screen overflow-hidden' : ''}`}>
          <AppSidebar />
          <SidebarInset className="flex flex-col flex-1">
            <TopNavbar />
            <main className={`flex-1 bg-background ${isFullScreenPage ? 'p-0 overflow-hidden' : 'p-6 overflow-auto'}`}>
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </EnrollmentProvider>
    </AuthGuard>
  );
}
