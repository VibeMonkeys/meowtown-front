import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { CuteAlert, useCuteAlert } from './ui/CuteAlert';
import { 
  X, 
  Plus, 
  MapPin, 
  Eye,
  HelpCircle,
  Megaphone,
  Sparkles
} from 'lucide-react';

interface CommunityPostFormProps {
  onSubmit: (postData: {
    type: 'sighting' | 'help' | 'update';
    content: string;
    catName: string;
    location: string;
  }) => void;
  onClose: () => void;
}

export function CommunityPostForm({ onSubmit, onClose }: CommunityPostFormProps) {
  const { alertProps, showWarning } = useCuteAlert();
  const [type, setType] = useState<'sighting' | 'help' | 'update'>('sighting');
  const [content, setContent] = useState('');
  const [catName, setCatName] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !catName.trim() || !location.trim()) {
      showWarning('모든 필드를 입력해주세요!', '입력 확인 🙀');
      return;
    }
    
    onSubmit({
      type,
      content: content.trim(),
      catName: catName.trim(),
      location: location.trim()
    });
    
    // 폼 초기화
    setContent('');
    setCatName('');
    setLocation('');
  };

  const postTypes = [
    { id: 'sighting' as const, label: '👀 목격 신고', icon: Eye, description: '고양이를 목격했어요!' },
    { id: 'help' as const, label: '🆘 도움 요청', icon: HelpCircle, description: '도움이 필요해요!' },
    { id: 'update' as const, label: '📢 업데이트', icon: Megaphone, description: '소식을 공유해요!' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <Card className="card-earthy w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b-2" style={{background: 'var(--gradient-warm)', borderColor: 'var(--primary-200)'}}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl bg-clip-text text-transparent flex items-center gap-3" style={{background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              <div className="relative">
                <Plus className="w-6 h-6" style={{color: 'var(--primary-500)'}} />
                <Sparkles className="w-3 h-3 absolute -top-1 -right-1" style={{color: 'var(--accent-400)'}} />
              </div>
              📝 게시글 작성
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="btn-cute bg-white/80 hover:bg-red-50 text-gray-600 hover:text-red-500 border border-red-200 w-8 h-8 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 bg-gradient-to-br from-white to-pink-25">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 게시글 타입 선택 */}
            <div>
              <label className="block text-lg font-bold text-pink-600 mb-4">
                🏷️ 게시글 종류
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {postTypes.map((postType) => {
                  const Icon = postType.icon;
                  return (
                    <button
                      key={postType.id}
                      type="button"
                      onClick={() => setType(postType.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        type === postType.id
                          ? 'bg-gradient-to-r from-pink-100 to-purple-100 border-pink-300 shadow-md'
                          : 'bg-white border-gray-200 hover:border-pink-200'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Icon className={`w-6 h-6 ${type === postType.id ? 'text-pink-600' : 'text-gray-400'}`} />
                        <span className={`font-semibold text-sm ${type === postType.id ? 'text-pink-600' : 'text-gray-600'}`}>
                          {postType.label}
                        </span>
                        <span className={`text-xs ${type === postType.id ? 'text-purple-500' : 'text-gray-400'}`}>
                          {postType.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 고양이 이름 */}
            <div>
              <label className="block text-lg font-bold text-pink-600 mb-3">
                🐱 고양이 이름
              </label>
              <Input
                type="text"
                placeholder="고양이 이름을 입력하세요 (예: 나비, 치즈, 콩이)"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                className="input-cute h-12 text-base"
                required
              />
            </div>

            {/* 위치 */}
            <div>
              <label className="block text-lg font-bold text-pink-600 mb-3">
                📍 위치
              </label>
              <Input
                type="text"
                placeholder="위치를 입력하세요 (예: 강남역 3번 출구, 홍대입구역 근처)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-cute h-12 text-base"
                required
              />
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-lg font-bold text-pink-600 mb-3">
                ✍️ 내용
              </label>
              <Textarea
                placeholder={
                  type === 'sighting' 
                    ? "고양이를 목격한 상황을 자세히 설명해주세요.\n예: 오늘 오후 3시경 카페 앞에서 흰색 고양이를 봤어요. 목에 빨간 목걸이를 하고 있었습니다."
                    : type === 'help'
                    ? "어떤 도움이 필요한지 자세히 설명해주세요.\n예: 다친 고양이를 발견했는데 어떻게 해야 할지 모르겠어요. 병원 정보나 응급처치 방법을 알려주세요."
                    : "공유하고 싶은 소식을 자세히 적어주세요.\n예: 길고양이 급식소가 새로 생겼어요! 매일 오전 8시와 오후 6시에 밥을 주고 있습니다."
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-32 text-base resize-none"
                required
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {content.length}/500자
                </span>
                {content.length > 500 && (
                  <span className="text-sm text-red-500">
                    글자 수를 초과했습니다!
                  </span>
                )}
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                className="btn-cute bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 flex-1"
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={!content.trim() || !catName.trim() || !location.trim() || content.length > 500}
                className="btn-cute btn-cute-primary flex-1 gap-2"
              >
                <Plus className="w-4 h-4" />
                게시글 작성
                <span className="ml-1">✨</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Cute Alert */}
      <CuteAlert {...alertProps} />
    </div>
  );
}