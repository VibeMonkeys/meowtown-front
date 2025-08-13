import { useState } from 'react';
import { Header } from './components/Header';
import { CatCard } from './components/CatCard';
import { StatsSection } from './components/StatsSection';
import { AddCatForm } from './components/AddCatForm';
import { MapView } from './components/MapView';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { 
  Plus, 
  Filter, 
  SortDesc,
  Calendar,
  MapPin,
  Heart,
  MessageSquare
} from 'lucide-react';

// Mock data
const mockCats = [
  {
    id: '1',
    name: '치즈',
    image: 'https://images.unsplash.com/photo-1655824845979-bb6f016a19e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwc3RyZWV0JTIwY2F0JTIwb3JhbmdlJTIwdGFiYnl8ZW58MXx8fHwxNzU1MDg4ODY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: '서초구 반포동 래미안 아파트',
    lastSeen: '2시간 전',
    description: '오렌지 털색의 친근한 고양이입니다. 사람을 무서워하지 않고 쓰다듬어주면 좋아해요.',
    characteristics: ['치즈', '친근함', '주황털', '짧은털'],
    reportedBy: {
      name: '김민수',
      avatar: undefined
    },
    likes: 24,
    comments: 8,
    isNeutered: true,
    estimatedAge: '2-3살',
    gender: 'male' as const,
    lat: 37.5665,
    lng: 126.9780,
    reportCount: 15
  },
  {
    id: '2',
    name: '나비',
    image: 'https://images.unsplash.com/photo-1639676507418-1990e27a4254?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdoaXRlJTIwc3RyZWV0JTIwY2F0fGVufDF8fHx8MTc1NTA4ODg2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: '강남구 역삼동 공원',
    lastSeen: '어제',
    description: '흑백 털색의 아름다운 고양이입니다. 조금 경계심이 있지만 차츰 다가가면 친해질 수 있어요.',
    characteristics: ['턱시도', '경계심많음', '예쁨', '중간크기'],
    reportedBy: {
      name: '정미선',
      avatar: undefined
    },
    likes: 18,
    comments: 5,
    isNeutered: false,
    estimatedAge: '1-2살',
    gender: 'female' as const,
    lat: 37.5665,
    lng: 126.9780,
    reportCount: 8
  },
  {
    id: '3',
    name: '회돌이',
    image: 'https://images.unsplash.com/photo-1745363562836-8331bedbe542?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmF5JTIwdGFiYnklMjBjYXQlMjBvdXRkb29yfGVufDF8fHx8MTc1NTA4ODg2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: '송파구 잠실동 아파트 단지',
    lastSeen: '3일 전',
    description: '회색 줄무늬 고양이입니다. 매우 활발하고 호기심이 많아요.',
    characteristics: ['회색', '줄무늬', '활발함', '호기심많음'],
    reportedBy: {
      name: '박영희',
      avatar: undefined
    },
    likes: 12,
    comments: 3,
    isNeutered: true,
    estimatedAge: '성체',
    gender: 'male' as const,
    lat: 37.5665,
    lng: 126.9780,
    reportCount: 12
  },
  {
    id: '4',
    name: '삼색이',
    image: 'https://images.unsplash.com/photo-1655978328281-393ed228068a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxpY28lMjBjYXQlMjBzdHJlZXR8ZW58MXx8fHwxNzU1MDg4ODcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: '마포구 합정동 상가 뒤편',
    lastSeen: '1주일 전',
    description: '삼색 털색의 특별한 고양이입니다. 조금 수줍음을 타지만 먹이를 주면 다가와요.',
    characteristics: ['삼색이', '수줍음', '특별함', '먹이좋아함'],
    reportedBy: {
      name: '이수진',
      avatar: undefined
    },
    likes: 31,
    comments: 12,
    isNeutered: false,
    estimatedAge: '어린고양이',
    gender: 'female' as const,
    lat: 37.5665,
    lng: 126.9780,
    reportCount: 6
  },
  {
    id: '5',
    name: '시암이',
    image: 'https://images.unsplash.com/photo-1568152950566-c1bf43f4ab28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWFtZXNlJTIwY2F0JTIwb3V0ZG9vcnxlbnwxfHx8fDE3NTUwODg4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: '용산구 이태원동 카페거리',
    lastSeen: '5일 전',
    description: '시암 고양이 같은 외모의 고양이입니다. 매우 우아하고 품격있어 보여요.',
    characteristics: ['시암', '우아함', '품격', '파란눈'],
    reportedBy: {
      name: '최민호',
      avatar: undefined
    },
    likes: 26,
    comments: 7,
    isNeutered: true,
    estimatedAge: '3-4살',
    gender: 'unknown' as const,
    lat: 37.5665,
    lng: 126.9780,
    reportCount: 9
  }
];

const mockStats = {
  totalCats: 127,
  newCatsThisWeek: 8,
  activeCaregivers: 23,
  neutralizedCats: 89,
  totalSightings: 342,
  photosUploaded: 856
};

const communityPosts = [
  {
    id: '1',
    type: 'sighting',
    author: '김민수',
    time: '30분 전',
    content: '치즈가 오늘도 같은 자리에서 낮잠 자고 있네요 🐱',
    catName: '치즈',
    location: '서초구 반포동',
    likes: 5,
    comments: 2
  },
  {
    id: '2',
    type: 'help',
    author: '정미선',
    time: '2시간 전',
    content: '나비가 며칠째 보이지 않습니다. 혹시 목격하신 분 있나요?',
    catName: '나비',
    location: '강남구 역삼동',
    likes: 8,
    comments: 4
  },
  {
    id: '3',
    type: 'update',
    author: '박영희',
    time: '1일 전',
    content: '회돌이 중성화 수술 완료했습니다! 건강하게 회복 중이에요 💚',
    catName: '회돌이',
    location: '송파구 잠실동',
    likes: 15,
    comments: 8
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const handleAddCat = (catData: any) => {
    console.log('새 고양이 등록:', catData);
    setShowAddForm(false);
    // 실제로는 여기서 API 호출
  };

  const handleCatLike = (catId: string) => {
    console.log('좋아요:', catId);
  };

  const handleCatComment = (catId: string) => {
    console.log('댓글:', catId);
  };

  const handleCatShare = (catId: string) => {
    console.log('공유:', catId);
  };

  const renderContent = () => {
    if (showAddForm) {
      return (
        <AddCatForm
          onSubmit={handleAddCat}
          onCancel={() => setShowAddForm(false)}
        />
      );
    }

    switch (currentView) {
      case 'map':
        return (
          <MapView
            cats={mockCats}
            onCatSelect={setSelectedCat}
          />
        );

      case 'guide':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2>우리동네 고양이 도감</h2>
                <p className="text-muted-foreground">등록된 모든 고양이들을 만나보세요</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <SortDesc className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCats.map((cat) => (
                <CatCard
                  key={cat.id}
                  cat={cat}
                  onLike={handleCatLike}
                  onComment={handleCatComment}
                  onShare={handleCatShare}
                />
              ))}
            </div>
          </div>
        );

      case 'community':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2>커뮤니티</h2>
                <p className="text-muted-foreground">이웃들과 고양이 소식을 공유하세요</p>
              </div>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                제보하기
              </Button>
            </div>

            <div className="space-y-4">
              {communityPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-sm">
                          {post.author.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm">{post.author}</span>
                          <span className="text-xs text-muted-foreground">{post.time}</span>
                          <Badge variant="outline" className="text-xs">
                            {post.type === 'sighting' ? '목격' : 
                             post.type === 'help' ? '도움요청' : '업데이트'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm mb-3">{post.content}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{post.catName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{post.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Heart className="w-4 h-4 mr-1" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {post.comments}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default: // home
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary-foreground text-2xl">🐱</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">우리동네 냥이도감</h1>
                <p className="text-muted-foreground">
                  이웃과 함께 만드는 길고양이 관찰 플랫폼
                </p>
              </div>
              <Button onClick={() => setShowAddForm(true)} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                새 고양이 등록하기
              </Button>
            </div>

            {/* Stats Section */}
            <StatsSection stats={mockStats} />

            {/* Recent Cats */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2>최근 등록된 고양이들</h2>
                  <p className="text-muted-foreground">이웃들이 새로 발견한 고양이들을 만나보세요</p>
                </div>
                <Button variant="outline" onClick={() => setCurrentView('guide')}>
                  전체 보기
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCats.slice(0, 3).map((cat) => (
                  <CatCard
                    key={cat.id}
                    cat={cat}
                    onLike={handleCatLike}
                    onComment={handleCatComment}
                    onShare={handleCatShare}
                  />
                ))}
              </div>
            </div>

            {/* Recent Community Activity */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2>최근 커뮤니티 소식</h2>
                  <p className="text-muted-foreground">이웃들의 최신 제보와 소식들</p>
                </div>
                <Button variant="outline" onClick={() => setCurrentView('community')}>
                  전체 보기
                </Button>
              </div>

              <div className="space-y-3">
                {communityPosts.slice(0, 2).map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{post.author}</span>
                          <Badge variant="outline" className="text-xs">
                            {post.catName}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{post.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{post.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentView={currentView}
        onViewChange={setCurrentView}
        notificationCount={3}
      />
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
}