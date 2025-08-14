import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Bell,
  X,
  Camera,
  Heart,
  MessageSquare,
  MapPin,
  CheckCircle,
  AlertCircle,
  Info,
  Trash2,
  Sparkles
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'cat_registered' | 'cat_liked' | 'cat_commented' | 'cat_sighted' | 'system' | 'warning';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  avatar?: string;
  catName?: string;
  userName?: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onDeleteNotification: (notificationId: string) => void;
  onClearAll: () => void;
}

export function NotificationPanel({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAsRead, 
  onDeleteNotification,
  onClearAll 
}: NotificationPanelProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || !notification.isRead
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'cat_registered':
        return <Camera className="w-5 h-5 text-green-500" />;
      case 'cat_liked':
        return <Heart className="w-5 h-5 text-red-500 fill-current" />;
      case 'cat_commented':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'cat_sighted':
        return <MapPin className="w-5 h-5 text-purple-500" />;
      case 'system':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-pink-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-2 sm:right-4 top-20 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl h-auto max-h-[calc(100vh-8rem)] overflow-hidden z-[60] mx-2 sm:mx-0">
        <div className="card-cute border-0 shadow-cute overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-0 border-b-2 border-pink-200 flex flex-row items-center justify-between space-y-0 pb-4 pt-4 px-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-6 h-6 text-pink-500" />
                <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400" />
              </div>
              <h3 className="text-xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-bold flex items-center gap-2">
                🔔 알림
                {unreadCount > 0 && (
                  <Badge className="bg-gradient-to-r from-red-400 to-pink-500 text-white text-xs shadow-md animate-pulse">
                    {unreadCount}
                  </Badge>
                )}
              </h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="btn-cute bg-white/80 hover:bg-red-50 text-gray-600 hover:text-red-500 border border-red-200 w-8 h-8 rounded-full transition-all duration-300 hover:scale-110"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="bg-gradient-to-br from-white to-pink-25 space-y-4 h-auto overflow-hidden p-6">
            {/* Filter Tabs */}
            <div className="flex gap-3">
              <Button 
                className={filter === 'all' ? 'btn-cute btn-cute-primary' : 'btn-cute btn-cute-secondary'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                📊 전체 ({notifications.length})
              </Button>
              <Button 
                className={filter === 'unread' ? 'btn-cute btn-cute-primary' : 'btn-cute btn-cute-secondary'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                🆕 읽지 않음 ({unreadCount})
              </Button>
            </div>

            {/* Clear All Button */}
            {notifications.length > 0 && (
              <div className="flex justify-end">
                <Button 
                  className="btn-cute bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-red-100 hover:to-pink-100 hover:text-red-500 transition-all duration-300 hover:scale-105 shadow-sm"
                  size="sm" 
                  onClick={onClearAll}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  🗑️ 모두 삭제
                </Button>
              </div>
            )}

            {/* Notifications List */}
            <div className="space-y-3 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#ec4899 #fce7f3' }}>
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Bell className="w-8 h-8 text-pink-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-pink-600 mb-2">
                    {filter === 'unread' ? '읽지 않은 알림이 없어요' : '알림이 없어요'}
                  </h3>
                  <p className="text-pink-400">
                    {filter === 'unread' ? '모든 알림을 확인하셨어요! 💕' : '아직 새로운 소식이 없어요 😸'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-cute p-4 rounded-xl border-0 shadow-cute transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      !notification.isRead 
                        ? 'bg-gradient-to-r from-pink-50 to-purple-50 shadow-md' 
                        : 'bg-gradient-to-r from-white to-gray-50'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {notification.avatar ? (
                          <Avatar className="w-10 h-10 border-2 border-pink-200 shadow-md">
                            <AvatarImage src={notification.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-pink-200 to-purple-200 text-pink-600 font-bold">
                              {notification.userName?.charAt(0) || '🐱'}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-pink-200 flex items-center justify-center shadow-md">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-semibold text-base leading-tight text-pink-700 mb-1">
                              {notification.title}
                            </p>
                            <p className="text-sm text-purple-600 leading-relaxed mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-pink-400 bg-pink-100 px-2 py-1 rounded-full">
                                🕰️ {notification.time}
                              </p>
                              {notification.catName && (
                                <p className="text-xs text-purple-500 bg-purple-100 px-2 py-1 rounded-full">
                                  🐱 {notification.catName}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <Button
                                onClick={() => onMarkAsRead(notification.id)}
                                className="btn-cute bg-gradient-to-r from-green-400 to-emerald-500 text-white w-8 h-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 p-0"
                                title="읽음 처리"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              onClick={() => onDeleteNotification(notification.id)}
                              className="btn-cute bg-gradient-to-r from-red-400 to-pink-500 text-white w-8 h-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 p-0"
                              title="삭제"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}