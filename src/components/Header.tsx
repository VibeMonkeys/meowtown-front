import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Search, 
  Plus, 
  Map, 
  Home, 
  BookOpen, 
  MessageSquare, 
  Bell,
  Menu,
  X
} from 'lucide-react';
import { Input } from './ui/input';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  notificationCount?: number;
  isAddingCat?: boolean;
  hasFormContent?: boolean;
  onAddCatClick?: () => void;
  onSearch?: (query: string) => void;
  onNotificationClick?: () => void;
  onAuthClick?: () => void;
  currentUser?: {
    userId: string;
    displayName: string;
  } | null;
  onLogout?: () => void;
}

export function Header({ currentView, onViewChange, notificationCount = 0, isAddingCat = false, hasFormContent = false, onAddCatClick, onSearch, onNotificationClick, onAuthClick, currentUser, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
    }
  };
  
  const handleNavigationClick = (viewId: string) => {
    if (isAddingCat && hasFormContent) {
      const confirmLeave = window.confirm('고양이 등록을 취소하시겠습니까? 작성한 내용이 사라집니다.');
      if (confirmLeave) {
        onViewChange(viewId);
      }
    } else {
      onViewChange(viewId);
    }
  };

  const navigationItems = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'map', label: '지도', icon: Map },
    { id: 'guide', label: '도감', icon: BookOpen },
    { id: 'community', label: '커뮤니티', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 card-cute backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b-0 shadow-lg">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavigationClick('home')}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-pink-500 flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <span className="text-white text-2xl">🐱</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs">✨</span>
                </div>
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-pink-200 rounded-full opacity-30"></div>
            </div>
            <div>
              <h1 className="hidden sm:block font-bold text-xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                MeowTown
              </h1>
              <p className="hidden sm:block text-xs text-pink-400 font-medium -mt-1">우리동네 냥이도감 💕</p>
              <h1 className="sm:hidden font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                냥이도감
              </h1>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="search"
                placeholder="어떤 냥이를 찾고 계신가요? 🔍"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-cute pl-6 pr-12 h-12 text-sm placeholder:text-pink-300"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-pink-300 z-10 pointer-events-none">
                🐾
              </div>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Add Cat Button */}
            <Button 
              className="hidden sm:flex items-center gap-2 btn-cute btn-cute-primary h-11 px-6 font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-0.5"
              onClick={onAddCatClick}
            >
              <Plus className="w-4 h-4" />
              냥이 등록
              <span className="ml-1">🐱</span>
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button 
                variant="ghost" 
                className="relative w-12 h-12 rounded-full bg-gradient-to-br from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 border-2 border-pink-200 hover:border-pink-300 transition-all duration-300 hover:scale-110"
                onClick={onNotificationClick}
              >
                <Bell className="w-5 h-5 text-pink-500" />
              </Button>
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </div>
              )}
            </div>

            {/* User Area */}
            {currentUser ? (
              <div className="relative group">
                <Avatar className="w-12 h-12 border-3 border-pink-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <AvatarFallback className="bg-gradient-to-br from-pink-200 to-purple-200 text-pink-600 font-bold">
                    {currentUser.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                
                {/* User Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border-2 border-pink-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-4 border-b border-pink-100">
                    <p className="font-semibold text-pink-600">{currentUser.displayName}</p>
                    <p className="text-xs text-purple-500">@{currentUser.userId}</p>
                  </div>
                  <div className="p-2">
                    <Button 
                      onClick={onLogout}
                      className="w-full text-left btn-cute bg-gradient-to-r from-red-400 to-pink-500 text-white hover:from-red-500 hover:to-pink-600"
                    >
                      🚪 로그아웃
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Button 
                onClick={onAuthClick}
                className="btn-cute btn-cute-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                👤 로그인
                <span className="ml-1">🐱</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="고양이 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4"
            />
          </form>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block border-t border-pink-100 bg-gradient-to-r from-pink-25 to-purple-25">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-1 h-16">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const emojis = ['🏠', '🗺️', '📚', '💬'];
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigationClick(item.id)}
                  className={`relative flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    isActive 
                      ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg transform scale-105' 
                      : 'text-pink-600 hover:text-pink-700 hover:bg-pink-50'
                  }`}
                >
                  <span className="text-lg">{emojis[index]}</span>
                  <span className="hidden lg:block">{item.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleNavigationClick(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
              
              <div className="pt-2 mt-4 border-t">
                <Button 
                  className="w-full justify-start gap-3" 
                  size="sm"
                  onClick={() => {
                    onAddCatClick?.();
                    setIsMenuOpen(false);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  고양이 등록
                </Button>
              </div>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}