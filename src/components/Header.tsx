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
import { SearchSuggestions } from './ui/SearchSuggestions';

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
  
  // ESC 키로 메뉴 닫기
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isMenuOpen) {
      setIsMenuOpen(false);
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
    <header className="sticky top-0 z-50 card-cute backdrop-blur border-b-0 shadow-lg" style={{background: 'rgba(255, 255, 255, 0.6)'}}>
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavigationClick('home')}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500 flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" style={{background: 'var(--gradient-primary)'}}>
                <span className="text-white text-2xl">🐱</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{background: 'var(--accent-400)'}}>
                  <span className="text-xs">✨</span>
                </div>
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-2 rounded-full opacity-30" style={{background: 'var(--primary-200)'}}></div>
            </div>
            <div>
              <h1 className="hidden sm:block font-bold text-xl bg-gradient-to-r bg-clip-text text-transparent" style={{background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                MeowTown
              </h1>
              <p className="hidden sm:block text-xs font-medium -mt-1" style={{color: 'var(--text-primary-soft)'}}>우리동네 냥이도감 🐾</p>
              <h1 className="sm:hidden font-bold text-lg bg-gradient-to-r bg-clip-text text-transparent" style={{background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                냥이도감
              </h1>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchSuggestions
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={(query) => {
                setSearchQuery(query);
                onSearch?.(query);
              }}
              placeholder="어떤 냥이를 찾고 계신가요? 🔍"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Add Cat Button */}
            <Button 
              className="hidden sm:flex items-center gap-2 btn-earthy-primary h-11 px-6 font-medium transform transition-all duration-300 hover:-translate-y-0.5"
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
                className="relative w-12 h-12 rounded-full border-2 transition-all duration-300 hover:scale-110"
                style={{
                  background: 'var(--gradient-warm)',
                  borderColor: 'var(--primary-200)',
                }}
                onClick={onNotificationClick}
              >
                <Bell className="w-5 h-5" style={{color: 'var(--primary-500)'}} />
              </Button>
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse" style={{background: 'var(--gradient-secondary)'}}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </div>
              )}
            </div>

            {/* User Area */}
            {currentUser ? (
              <div className="relative group">
                <Avatar className="w-12 h-12 border-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" style={{borderColor: 'var(--primary-200)'}}>
                  <AvatarFallback className="font-bold" style={{background: 'var(--gradient-warm)', color: 'var(--primary-600)'}}>
                    {currentUser.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white" style={{background: 'var(--secondary-400)'}}></div>
                
                {/* User Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50" style={{borderColor: 'var(--primary-200)'}}>
                  <div className="p-4 border-b" style={{borderColor: 'var(--primary-100)'}}>
                    <p className="font-semibold" style={{color: 'var(--primary-600)'}}>{currentUser.displayName}</p>
                    <p className="text-xs" style={{color: 'var(--secondary-500)'}}>@{currentUser.userId}</p>
                  </div>
                  <div className="p-2">
                    <Button 
                      onClick={onLogout}
                      className="w-full text-left btn-earthy-secondary hover:bg-red-50"
                      style={{color: 'var(--error)'}}
                    >
                      🚪 로그아웃
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Button 
                onClick={onAuthClick}
                className="btn-earthy-primary transition-all duration-300 hover:scale-105 flex items-center gap-2"
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
          <SearchSuggestions
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={(query) => {
              setSearchQuery(query);
              onSearch?.(query);
            }}
            placeholder="고양이 검색... 🔍"
            className="w-full"
          />
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block border-t" style={{borderColor: 'var(--primary-100)', background: 'var(--gradient-warm)'}}>
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
                      ? 'text-white shadow-lg transform scale-105' 
                      : 'hover:scale-105'
                  }`}
                  style={isActive 
                    ? {background: 'var(--gradient-primary)', color: 'white'} 
                    : {color: 'var(--text-primary-soft)', backgroundColor: 'transparent'}
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--primary-50)';
                      e.currentTarget.style.color = 'var(--text-primary-soft)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-primary-soft)';
                    }
                  }}
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