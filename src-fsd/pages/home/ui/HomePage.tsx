import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../shared/ui/button';
import { CatCard } from '../../../entities/cat';
import { AddCatForm } from '../../../features/cat-registration';
import { catApi } from '../../../entities/cat/api/catApi';
import type { Cat, Stats, CommunityPost, CatRegistrationForm } from '../../../shared/types';

// 임시 통계 데이터 (TODO: 실제 API 연동)
const mockStats: Stats = {
  totalCats: 1, // 실제로는 API에서 조회
  newCatsThisWeek: 1,
  activeCaregivers: 1,
  neutralizedCats: 1,
  totalSightings: 1,
  photosUploaded: 0
};

const mockCommunityPosts: CommunityPost[] = [
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
  }
];

interface HomePageProps {
  onViewChange: (view: string) => void;
}

export function HomePage({ onViewChange }: HomePageProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [stats] = useState<Stats>(mockStats); // TODO: 실제 통계 API 연동
  const [recentCats, setRecentCats] = useState<Cat[]>([]);
  const [communityPosts] = useState<CommunityPost[]>(mockCommunityPosts.slice(0, 2)); // TODO: 실제 커뮤니티 API 연동
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 최근 고양이 목록 로드
  useEffect(() => {
    const loadRecentCats = async () => {
      try {
        setLoading(true);
        const response = await catApi.getCats({ 
          page: 0, 
          size: 3 // 최근 3마리만 
        });
        
        if (response.success && response.data) {
          setRecentCats(Array.isArray(response.data) ? response.data : response.data.content || []);
        } else {
          console.error('고양이 목록 조회 실패:', response);
          setError('고양이 목록을 불러올 수 없습니다.');
        }
      } catch (err) {
        console.error('API 호출 에러:', err);
        setError('네트워크 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadRecentCats();
  }, []);

  const handleAddCat = async (catData: CatRegistrationForm) => {
    try {
      console.log('새 고양이 등록:', catData);
      
      // 실제 API 호출
      const response = await catApi.createCat({
        name: catData.name,
        location: catData.location,
        description: catData.description,
        characteristics: catData.characteristics,
        isNeutered: catData.isNeutered,
        estimatedAge: catData.estimatedAge,
        gender: catData.gender,
        coordinates: catData.coordinates
      });

      if (response.success) {
        console.log('고양이 등록 성공:', response.data);
        setShowAddForm(false);
        
        // 최근 고양이 목록 새로고침
        const updatedResponse = await catApi.getCats({ page: 0, size: 3 });
        if (updatedResponse.success && updatedResponse.data) {
          setRecentCats(Array.isArray(updatedResponse.data) ? updatedResponse.data : updatedResponse.data.content || []);
        }
        
        // TODO: 성공 알림 추가
      } else {
        console.error('고양이 등록 실패:', response);
        alert('고양이 등록에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('고양이 등록 에러:', error);
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  const handleCatLike = (catId: string) => {
    console.log('좋아요:', catId);
    // 좋아요 API 호출
  };

  const handleCatComment = (catId: string) => {
    console.log('댓글:', catId);
    // 댓글 페이지로 이동 또는 댓글 모달 열기
  };

  const handleCatShare = (catId: string) => {
    console.log('공유:', catId);
    // 공유 기능
  };

  if (showAddForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <AddCatForm
          onSubmit={handleAddCat}
          onCancel={() => setShowAddForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="text-center p-4 bg-card rounded-lg border">
          <div className="text-2xl font-bold text-primary">{stats.totalCats}</div>
          <div className="text-sm text-muted-foreground">등록된 고양이</div>
        </div>
        <div className="text-center p-4 bg-card rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{stats.newCatsThisWeek}</div>
          <div className="text-sm text-muted-foreground">이번 주 신규</div>
        </div>
        <div className="text-center p-4 bg-card rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{stats.activeCaregivers}</div>
          <div className="text-sm text-muted-foreground">활동 케어러</div>
        </div>
        <div className="text-center p-4 bg-card rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">{stats.neutralizedCats}</div>
          <div className="text-sm text-muted-foreground">중성화 완료</div>
        </div>
        <div className="text-center p-4 bg-card rounded-lg border">
          <div className="text-2xl font-bold text-orange-600">{stats.totalSightings}</div>
          <div className="text-sm text-muted-foreground">총 목격 수</div>
        </div>
        <div className="text-center p-4 bg-card rounded-lg border">
          <div className="text-2xl font-bold text-pink-600">{stats.photosUploaded}</div>
          <div className="text-sm text-muted-foreground">업로드 사진</div>
        </div>
      </div>

      {/* Recent Cats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">최근 등록된 고양이들</h2>
            <p className="text-muted-foreground">이웃들이 새로 발견한 고양이들을 만나보세요</p>
          </div>
          <Button variant="outline" onClick={() => onViewChange('guide')}>
            전체 보기
          </Button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 bg-card rounded-lg border animate-pulse">
                <div className="w-full h-48 bg-muted rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              다시 시도
            </Button>
          </div>
        ) : recentCats.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCats.map((cat) => (
              <CatCard
                key={cat.id}
                cat={cat}
                onLike={handleCatLike}
                onComment={handleCatComment}
                onShare={handleCatShare}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">아직 등록된 고양이가 없습니다.</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              첫 번째 고양이 등록하기
            </Button>
          </div>
        )}
      </div>

      {/* Recent Community Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">최근 커뮤니티 소식</h2>
            <p className="text-muted-foreground">이웃들의 최신 제보와 소식들</p>
          </div>
          <Button variant="outline" onClick={() => onViewChange('community')}>
            전체 보기
          </Button>
        </div>

        <div className="space-y-3">
          {communityPosts.map((post) => (
            <div key={post.id} className="p-4 bg-card rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{post.author}</span>
                  {post.catName && (
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {post.catName}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{post.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}