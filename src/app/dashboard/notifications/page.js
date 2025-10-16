"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Check, 
  Star, 
  Info, 
  AlertCircle, 
  CheckCircle,
  Trash2
} from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { 
  getUserNotifications, 
  markNotificationAsRead,
  markMultipleNotificationsAsRead 
} from "@/lib/notifications";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.uid) return;
      
      try {
        const userNotifications = await getUserNotifications(user.uid);
        setNotifications(userNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.uid]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    const unreadIds = unreadNotifications.map(n => n.id);
    
    if (unreadIds.length === 0) return;

    try {
      await markMultipleNotificationsAsRead(unreadIds);
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'welcome':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
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

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true; // 'all'
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Bell className="h-8 w-8 text-gray-300 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500 font-montserrat">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-playfair">Notifications</h1>
          <p className="text-gray-600 mt-1 font-montserrat">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            onClick={handleMarkAllAsRead}
            className="bg-[#354fd2] text-white hover:bg-[#2a3fa8] font-montserrat font-medium"
          >
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-[#354fd2] text-white' : ''}
        >
          All ({notifications.length})
        </Button>
        <Button 
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
          className={filter === 'unread' ? 'bg-[#354fd2] text-white' : ''}
        >
          Unread ({unreadCount})
        </Button>
        <Button 
          variant={filter === 'read' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('read')}
          className={filter === 'read' ? 'bg-[#354fd2] text-white' : ''}
        >
          Read ({notifications.length - unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2 font-playfair">
              {filter === 'unread' && 'No unread notifications'}
              {filter === 'read' && 'No read notifications'}
              {filter === 'all' && 'No notifications yet'}
            </h3>
            <p className="text-gray-500 text-center max-w-md font-montserrat">
              {filter === 'all' 
                ? "We'll notify you when something important happens"
                : `You don't have any ${filter} notifications at the moment`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all duration-200 hover:shadow-md ${
                !notification.isRead ? 'ring-2 ring-blue-100 bg-blue-50/30' : 'hover:bg-gray-50'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-base font-semibold font-playfair ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className={`mt-1 text-sm font-montserrat ${
                          !notification.isRead ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-gray-400 font-montserrat">
                          {formatNotificationTime(notification.createdAt)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {!notification.isRead && (
                          <>
                            <div className="w-2 h-2 rounded-full bg-[#354fd2]"></div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-[#354fd2] hover:bg-[#354fd2] hover:text-white"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {notification.isRead && (
                          <Badge variant="secondary" className="text-xs">
                            Read
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}