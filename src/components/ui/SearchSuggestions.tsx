import { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, MapPin, Heart } from 'lucide-react';
import { Input } from './input';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'cat-name' | 'location';
  icon?: string;
  count?: number;
}

interface SearchSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  suggestions?: SearchSuggestion[];
  isLoading?: boolean;
}

// 샘플 검색 제안 데이터
const defaultSuggestions: SearchSuggestion[] = [
  { id: '1', text: '치즈', type: 'cat-name', icon: '🧀', count: 12 },
  { id: '2', text: '나비', type: 'cat-name', icon: '🦋', count: 8 },
  { id: '3', text: '검둥이', type: 'cat-name', icon: '🖤', count: 15 },
  { id: '4', text: '강남역', type: 'location', count: 25 },
  { id: '5', text: '홍대입구역', type: 'location', count: 18 },
  { id: '6', text: '삼색이', type: 'popular', count: 32 },
  { id: '7', text: '턱시도', type: 'popular', count: 24 },
  { id: '8', text: '친근함', type: 'popular', count: 19 },
];

const recentSearches: SearchSuggestion[] = [
  { id: 'r1', text: '치즈', type: 'recent' },
  { id: 'r2', text: '강남역 근처', type: 'recent' },
  { id: 'r3', text: '삼색이', type: 'recent' },
];

export function SearchSuggestions({
  value,
  onChange,
  onSearch,
  placeholder = "어떤 냥이를 찾고 계신가요? 🔍",
  className = "",
  suggestions = defaultSuggestions,
  isLoading = false
}: SearchSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 검색어에 따른 제안 필터링
  useEffect(() => {
    if (!value.trim()) {
      // 검색어가 없으면 최근 검색어와 인기 검색어 표시
      setFilteredSuggestions([
        ...recentSearches,
        ...suggestions.filter(s => s.type === 'popular').slice(0, 3)
      ]);
    } else {
      // 검색어가 있으면 매칭되는 제안들 표시
      const filtered = suggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setFilteredSuggestions(filtered);
    }
    setHighlightedIndex(-1);
  }, [value, suggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // 약간의 지연을 두어 클릭 이벤트가 먼저 실행되도록 함
    setTimeout(() => setIsOpen(false), 150);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    onSearch(suggestion.text);
    setIsOpen(false);
    
    // 최근 검색어에 추가
    const newRecent: SearchSuggestion = {
      id: `r_${Date.now()}`,
      text: suggestion.text,
      type: 'recent'
    };
    recentSearches.unshift(newRecent);
    // 최대 5개까지만 유지
    if (recentSearches.length > 5) {
      recentSearches.pop();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
          handleSuggestionClick(filteredSuggestions[highlightedIndex]);
        } else {
          onSearch(value);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    if (suggestion.icon) return suggestion.icon;
    
    switch (suggestion.type) {
      case 'recent':
        return <Clock className="w-4 h-4 text-purple-400" />;
      case 'popular':
        return <TrendingUp className="w-4 h-4 text-pink-400" />;
      case 'location':
        return <MapPin className="w-4 h-4 text-green-400" />;
      case 'cat-name':
        return <Heart className="w-4 h-4 text-red-400" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSuggestionLabel = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'recent':
        return '최근 검색';
      case 'popular':
        return '인기 검색';
      case 'location':
        return '위치';
      case 'cat-name':
        return '고양이 이름';
      default:
        return '';
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="input-cute pl-6 pr-12 h-12 text-sm placeholder:text-pink-300"
          autoComplete="off"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {isLoading ? (
            <div className="animate-spin text-pink-400">🔄</div>
          ) : (
            <span className="text-pink-300">🐾</span>
          )}
        </div>
      </div>

      {/* 검색 제안 드롭다운 */}
      {isOpen && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full mt-2 w-full bg-white dark:bg-dark-bg-secondary rounded-xl shadow-xl border-2 border-pink-200 dark:border-purple-500/30 z-50 max-h-80 overflow-y-auto search-suggestions"
        >
          {/* 제안 헤더 */}
          <div className="p-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-purple-50">
            <h3 className="text-sm font-semibold text-pink-600 flex items-center gap-2">
              <Search className="w-4 h-4" />
              {value.trim() ? '검색 제안' : '추천 검색어'}
              <span className="text-xs">✨</span>
            </h3>
          </div>

          {/* 검색 제안 목록 */}
          <div className="p-2">
            {filteredSuggestions.length > 0 ? (
              <div className="space-y-1">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 text-left group ${
                      index === highlightedIndex
                        ? 'bg-gradient-to-r from-pink-100 to-purple-100 shadow-md transform scale-[1.02]'
                        : 'hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-shrink-0">
                        {typeof getSuggestionIcon(suggestion) === 'string' ? (
                          <span className="text-lg">{getSuggestionIcon(suggestion)}</span>
                        ) : (
                          getSuggestionIcon(suggestion)
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700 group-hover:text-pink-600 transition-colors">
                            {value.trim() ? (
                              // 검색어 하이라이트
                              <>
                                {suggestion.text.split(new RegExp(`(${value})`, 'gi')).map((part, i) => (
                                  <span 
                                    key={i}
                                    className={part.toLowerCase() === value.toLowerCase() ? 'bg-yellow-200 text-pink-700 font-bold' : ''}
                                  >
                                    {part}
                                  </span>
                                ))}
                              </>
                            ) : (
                              suggestion.text
                            )}
                          </span>
                          {suggestion.count && (
                            <span className="text-xs bg-pink-100 text-pink-500 px-2 py-1 rounded-full">
                              {suggestion.count}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-purple-500 mt-1">
                          {getSuggestionLabel(suggestion)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Search className="w-4 h-4 text-pink-400" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-500 text-sm">검색 결과가 없습니다</p>
                <p className="text-xs text-pink-400 mt-1">다른 키워드로 검색해보세요</p>
              </div>
            )}
          </div>

          {/* 검색 팁 */}
          {!value.trim() && (
            <div className="p-4 border-t border-pink-100 bg-gradient-to-r from-purple-25 to-pink-25">
              <div className="text-xs text-purple-600 space-y-1">
                <p className="font-medium flex items-center gap-1">
                  💡 검색 팁
                </p>
                <p>• 고양이 이름, 위치, 특징으로 검색해보세요</p>
                <p>• 예: "치즈", "강남역", "삼색이" 등</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}