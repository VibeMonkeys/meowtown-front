import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CatCard } from './components/CatCard';
import { StatsSection } from './components/StatsSection';
import { AddCatForm } from './components/AddCatForm';
import { MapView } from './components/MapView';
import { CatDetail } from './components/CatDetail';
import { CommunityPostDetail } from './components/CommunityPostDetail';
import { CommunityPostForm } from './components/CommunityPostForm';
import { NotificationPanel } from './components/NotificationPanel';
import { FloatingActions } from './components/FloatingActions';
import { AuthModal } from './components/AuthModal';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { 
  Plus, 
  MapPin,
  Heart,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { apiClient, type Cat, type CatRegistrationForm, type CommunityPost, type CommunityComment, type AuthUser } from './api';
import './styles/cute-theme.css';

// 알림 데이터 타입 정의
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

// 실제 API에서 데이터를 가져옵니다

// 통계는 실제 고양이 수를 기반으로 계산
const getStats = (catsCount: number) => ({
  totalCats: catsCount,
  newCatsThisWeek: catsCount,
  activeCaregivers: Math.max(1, Math.floor(catsCount / 5)), 
  neutralizedCats: Math.floor(catsCount * 0.7),
  totalSightings: catsCount * 3,
  photosUploaded: catsCount
});

// 초기 샘플 데이터 (실제 API에서 로드될 때까지 사용)
// 커뮤니티 게시글은 API에서 로드

// 샘플 알림 데이터
const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'cat_registered',
    title: '새 고양이 등록',
    message: '치즈가 성공적으로 등록되었습니다.',
    time: '30분 전',
    isRead: false,
    catName: '치즈',
    userName: '김민수'
  },
  {
    id: '2',
    type: 'cat_liked',
    title: '좋아요 알림',
    message: '나비에게 새로운 좋아요가 있습니다.',
    time: '1시간 전',
    isRead: false,
    catName: '나비',
    userName: '정미선'
  },
  {
    id: '3',
    type: 'cat_sighted',
    title: '고양이 목격',
    message: '회돌이가 새로운 위치에서 목격되었습니다.',
    time: '2시간 전',
    isRead: true,
    catName: '회돌이',
    userName: '박영희'
  }
];

interface SightingRecord {
  id: string;
  catId: string;
  type: 'sighting' | 'photo' | 'report' | 'registered';
  description: string;
  time: string;
  reporter: string;
  location?: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [detailCat, setDetailCat] = useState<Cat | null>(null);
  const [detailPost, setDetailPost] = useState<CommunityPost | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFormContent, setHasFormContent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Cat[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [postComments, setPostComments] = useState<Record<string, CommunityComment[]>>({});
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [communityLoading, setCommunityLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [sightingRecords, setSightingRecords] = useState<SightingRecord[]>([]);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  
  // 현재 사용자명 (로그인된 사용자 또는 기본값)
  const currentUserName = currentUser?.displayName || '익명 사용자';

  // 고양이 등록 버튼 클릭 핸들러
  const handleAddCatClick = () => {
    if (!requireLogin('고양이 등록', handleAddCatClick)) return;
    setShowAddForm(true);
  };

  // 로그인 확인 함수 - 콜백을 받아서 로그인 후 자동 실행
  const requireLogin = (action: string, callback?: () => void): boolean => {
    if (!currentUser) {
      if (callback) {
        setPendingAction(() => callback);
      }
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  // 댓글 토글 함수
  const togglePostComments = (postId: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
        // 댓글을 처음 열 때 댓글 목록 로드
        if (!postComments[postId]) {
          loadPostComments(postId);
        }
      }
      return newSet;
    });
  };

  // 게시글 댓글 로드
  const loadPostComments = async (postId: string) => {
    try {
      const response = await apiClient.getPostComments(postId);
      
      if (response.success) {
        setPostComments(prev => ({
          ...prev,
          [postId]: response.data || []
        }));
      } else {
        console.warn('댓글을 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('댓글 로드 에러:', error);
      // 에러 시 빈 배열로 설정
      setPostComments(prev => ({
        ...prev,
        [postId]: []
      }));
    }
  };

  // 고양이 목록 및 커뮤니티 데이터 로드
  useEffect(() => {
    loadCats();
    loadCommunityPosts();
  }, []);

  const loadCats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getCats();
      
      if (response.success) {
        setCats(response.data || []);
      } else {
        setError('고양이 목록을 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error('API 호출 에러:', err);
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadCommunityPosts = async () => {
    try {
      setCommunityLoading(true);
      const response = await apiClient.getCommunityPosts();
      
      if (response.success) {
        setCommunityPosts(response.data || []);
      } else {
        console.warn('커뮤니티 게시글을 불러올 수 없습니다. 샘플 데이터를 사용합니다.');
      }
    } catch (err) {
      console.error('커뮤니티 API 호출 에러:', err);
      console.warn('샘플 데이터를 사용합니다.');
    } finally {
      setCommunityLoading(false);
    }
  };

  const handleAddCat = async (catData: any) => {
    if (!requireLogin('고양이 등록', () => handleAddCat(catData))) return;
    
    try {
      console.log('새 고양이 등록:', catData);
      
      // 이미지 처리 (첫 번째 이미지를 리사이즈하고 Base64로 변환)
      let imageBase64 = null;
      if (catData.images && catData.images.length > 0) {
        const file = catData.images[0];
        
        // 이미지 리사이즈 함수
        const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = (e) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // 비율을 유지하면서 리사이즈
                if (width > height) {
                  if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                  }
                } else {
                  if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                  }
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                
                // JPEG로 압축 (품질 0.8)
                resolve(canvas.toDataURL('image/jpeg', 0.8));
              };
              img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
          });
        };
        
        // 이미지를 800x800 이하로 리사이즈
        imageBase64 = await resizeImage(file, 800, 800);
        console.log('이미지 리사이즈 및 Base64 변환 완료');
      }
      
      // CatFormData를 CatRegistrationForm으로 변환 + 임시 좌표 추가
      const registrationData: CatRegistrationForm & { imageBase64?: string } = {
        name: catData.name,
        location: catData.location,
        description: catData.description,
        characteristics: catData.characteristics,
        isNeutered: catData.isNeutered,
        estimatedAge: catData.estimatedAge,
        gender: catData.gender,
        coordinates: {
          lat: 37.5665, // 임시 좌표 (서울 시청)
          lng: 126.9780
        },
        imageBase64: imageBase64 || undefined
      };
      
      console.log('API 호출 데이터:', registrationData);
      const response = await apiClient.createCat(registrationData);
      
      if (response.success) {
        console.log('고양이 등록 성공:', response.data);
        setShowAddForm(false);
        
        // 초기 목격 이력 추가
        const registeredCat = response.data;
        if (registeredCat && registeredCat.id) {
          const initialSighting: SightingRecord = {
            id: Date.now().toString(),
            catId: registeredCat.id,
            type: 'registered',
            description: `${catData.location}에서 처음 등록되었습니다`,
            time: '방금 전',
            reporter: currentUserName
          };
          setSightingRecords(prev => [initialSighting, ...prev]);
        }
        
        // 알림 추가
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'cat_registered',
          title: '새 고양이 등록',
          message: `${catData.name}이(가) 성공적으로 등록되었습니다.`,
          time: '방금 전',
          isRead: false,
          catName: catData.name,
          userName: currentUserName
        };
        setNotifications(prev => [newNotification, ...prev]);
        
        // 목록 새로고침
        await loadCats();
        
        alert('고양이가 성공적으로 등록되었습니다!');
      } else {
        console.error('고양이 등록 실패 응답:', response);
        alert(`고양이 등록에 실패했습니다: ${response.message || '알 수 없는 오류'}`);
      }
    } catch (error: any) {
      console.error('고양이 등록 에러 상세:', error);
      console.error('에러 메시지:', error.message);
      console.error('에러 스택:', error.stack);
      
      let errorMessage = '네트워크 오류가 발생했습니다.';
      if (error.message) {
        errorMessage += `\n\n상세 정보: ${error.message}`;
      }
      if (error.response) {
        errorMessage += `\n\n서버 응답: ${JSON.stringify(error.response)}`;
      }
      
      alert(errorMessage);
    }
  };

  const handleCatLike = async (catId: string) => {
    if (!requireLogin('고양이 좋아요', () => handleCatLike(catId))) return;
    
    try {
      // API 호출로 좋아요 토글
      const response = await apiClient.toggleCatLike(catId);
      const { isLiked, likeCount } = response.data;
      
      // 고양이 목록 상태 업데이트
      setCats(prevCats => 
        prevCats.map(cat => {
          if (cat.id === catId) {
            return {
              ...cat,
              likes: likeCount,
              isLiked: isLiked
            };
          }
          return cat;
        })
      );
      
      // detailCat도 업데이트
      if (detailCat && detailCat.id === catId) {
        setDetailCat(prev => prev ? { 
          ...prev, 
          likes: likeCount,
          isLiked: isLiked 
        } : null);
      }
      
      // 알림 생성 (좋아요를 추가했을 때만)
      if (isLiked) {
        const cat = cats.find(c => c.id === catId) || detailCat;
        if (cat) {
          const newNotification: Notification = {
            id: Date.now().toString(),
            type: 'cat_liked',
            title: '좋아요 알림',
            message: `${cat.name}에게 좋아요를 눌렀습니다.`,
            time: '방금 전',
            isRead: false,
            catName: cat.name,
            userName: currentUserName
          };
          setNotifications(prev => [newNotification, ...prev]);
        }
      }
      
      console.log('좋아요 토글 완료:', catId, '상태:', isLiked, '개수:', likeCount);
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
    }
  };

  const handleCatComment = (catId: string) => {
    if (!requireLogin('고양이 댓글', () => handleCatComment(catId))) return;
    
    const cat = cats.find(c => c.id === catId) || detailCat;
    if (!cat) return;
    
    const commentContent = prompt(`${cat.name}에게 댓글을 남겨주세요:`);
    if (!commentContent || !commentContent.trim()) return;
    
    // 댓글 수 증가
    setCats(prevCats => 
      prevCats.map(c => {
        if (c.id === catId) {
          return {
            ...c,
            comments: c.comments + 1
          };
        }
        return c;
      })
    );
    
    // detailCat도 업데이트
    if (detailCat && detailCat.id === catId) {
      setDetailCat(prev => prev ? { ...prev, comments: prev.comments + 1 } : null);
    }
    
    // 알림 생성
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: 'cat_commented',
      title: '댓글 알림',
      message: `${cat.name}에게 댓글을 남겼습니다: "${commentContent.slice(0, 20)}${commentContent.length > 20 ? '...' : ''}"`,
      time: '방금 전',
      isRead: false,
      catName: cat.name,
      userName: currentUserName
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    alert('댓글이 등록되었습니다.');
    console.log('댓글:', catId, commentContent);
  };

  const handleCatShare = (catId: string) => {
    const cat = cats.find(c => c.id === catId);
    if (!cat) return;
    
    if (navigator.share) {
      navigator.share({
        title: `우리동네 냥이도감 - ${cat.name}`,
        text: `${cat.name}을(를) 소개합니다! ${cat.description}`,
        url: window.location.href
      }).then(() => {
        console.log('공유 성공');
      }).catch((error) => {
        console.log('공유 실패:', error);
        fallbackShare(cat);
      });
    } else {
      fallbackShare(cat);
    }
  };

  const fallbackShare = (cat: any) => {
    const shareText = `우리동네 냥이도감 - ${cat.name}\n${cat.description}\n${window.location.href}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('공유 링크가 클립보드에 복사되었습니다!');
      }).catch(() => {
        prompt('아래 텍스트를 복사해서 공유해주세요:', shareText);
      });
    } else {
      prompt('아래 텍스트를 복사해서 공유해주세요:', shareText);
    }
  };

  // 커뮤니티 게시글 좋아요 토글
  const handlePostLike = async (postId: string) => {
    if (!requireLogin('좋아요', () => handlePostLike(postId))) return;
    
    try {
      const response = await apiClient.togglePostLike(postId);
      if (response.success) {
        // 백엔드에서 받은 실제 데이터로 업데이트
        setCommunityPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                isLiked: response.data.isLiked,
                likes: response.data.likes
              };
            }
            return post;
          })
        );
        
        console.log('좋아요 성공:', response.data);
      }
    } catch (error) {
      console.error('좋아요 에러:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  // 커뮤니티 게시글 댓글 버튼
  const handlePostComment = async (postId: string) => {
    if (!requireLogin('댓글 작성', () => handlePostComment(postId))) return;
    
    const commentContent = prompt('댓글을 입력하세요:');
    if (!commentContent || !commentContent.trim()) return;
    
    try {
      // 백엔드 API로 댓글 작성
      const response = await apiClient.createComment(postId, {
        content: commentContent.trim(),
        author: currentUser!.displayName
      });

      if (response.success) {
        // 댓글 목록에 추가
        setPostComments(prev => ({
          ...prev,
          [postId]: [response.data, ...(prev[postId] || [])]
        }));

        // 게시글 댓글 수 증가
        setCommunityPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                comments: post.comments + 1
              };
            }
            return post;
          })
        );

        // 댓글 섹션 자동으로 열기
        setExpandedPosts(prev => new Set(Array.from(prev).concat(postId)));
        
        // 알림 생성
        const notification: Notification = {
          id: Date.now().toString(),
          type: 'cat_commented',
          title: '댓글 작성',
          message: `댓글을 작성했습니다: "${commentContent.substring(0, 20)}${commentContent.length > 20 ? '...' : ''}"`,
          time: '방금 전',
          isRead: false,
          userName: currentUser!.displayName
        };
        setNotifications(prev => [notification, ...prev]);
        
        console.log('댓글 작성 성공:', response.data);
      }
    } catch (error) {
      console.error('댓글 작성 에러:', error);
      alert('댓글 작성 중 오류가 발생했습니다.');
    }
  };

  // 대댓글 작성 함수
  const handleReplyComment = async (postId: string, parentCommentId: string) => {
    if (!requireLogin('대댓글 작성', () => handleReplyComment(postId, parentCommentId))) return;
    
    const replyContent = prompt('대댓글을 입력하세요:');
    if (!replyContent || !replyContent.trim()) return;
    
    try {
      // 백엔드 API로 대댓글 작성
      const response = await apiClient.createComment(postId, {
        content: replyContent.trim(),
        author: currentUser!.displayName,
        parentId: parentCommentId
      });

      if (response.success) {
        // 대댓글을 부모 댓글에 추가
        setPostComments(prev => ({
          ...prev,
          [postId]: prev[postId]?.map(comment => {
            if (comment.id === parentCommentId) {
              return {
                ...comment,
                replies: [response.data, ...(comment.replies || [])]
              };
            }
            return comment;
          }) || []
        }));

        // 알림 생성
        const notification: Notification = {
          id: Date.now().toString(),
          type: 'cat_commented',
          title: '대댓글 작성',
          message: `대댓글을 작성했습니다: "${replyContent.substring(0, 20)}${replyContent.length > 20 ? '...' : ''}"`,
          time: '방금 전',
          isRead: false,
          userName: currentUser!.displayName
        };
        setNotifications(prev => [notification, ...prev]);
        
        console.log('대댓글 등록 성공:', response.data);
      }
    } catch (error) {
      console.error('대댓글 등록 에러:', error);
      alert('대댓글 등록 중 오류가 발생했습니다.');
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      setIsSearching(true);
      setSearchQuery(query);
      setCurrentView('search');
      
      const response = await apiClient.searchCatsByName(query);
      if (response.success) {
        setSearchResults(response.data || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('검색 에러:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 고양이 상세 보기 핸들러
  const handleCatSelect = (catId: string) => {
    const cat = cats.find(c => c.id === catId);
    if (cat) {
      setDetailCat(cat);
      setCurrentView('cat-detail');
    }
  };

  // 게시글 상세 보기 핸들러
  const handlePostSelect = (postId: string) => {
    const post = communityPosts.find(p => p.id === postId);
    if (post) {
      setDetailPost(post);
      setCurrentView('post-detail');
      // 댓글 로드
      if (!postComments[postId]) {
        loadPostComments(postId);
      }
    }
  };

  const handlePostSubmit = async (postData: {
    type: 'sighting' | 'help' | 'update';
    content: string;
    catName: string;
    location: string;
  }) => {
    if (!currentUser) return;

    try {
      const response = await apiClient.createCommunityPost({
        ...postData,
        author: currentUser.displayName
      });

      if (response.success) {
        // 백엔드에서 받은 실제 데이터로 업데이트
        setCommunityPosts(prev => [response.data, ...prev]);
        setShowPostForm(false);
        
        // 성공 알림
        alert('게시글이 성공적으로 작성되었습니다! 🎉');
        console.log('게시글 작성 성공:', response.data);
      }
    } catch (error) {
      console.error('게시글 작성 에러:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    }
  };

  // 알림 관련 핸들러들
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  // 목격 신고 핸들러
  const handleSightingReport = (catId: string, sightingInfo: string) => {
    const newSighting: SightingRecord = {
      id: Date.now().toString(),
      catId: catId,
      type: 'sighting',
      description: sightingInfo,
      time: '방금 전',
      reporter: currentUserName,
      location: sightingInfo.split(',')[0] || '위치 미상'
    };
    
    setSightingRecords(prev => [newSighting, ...prev]);
    
    // 알림 생성
    const cat = cats.find(c => c.id === catId);
    if (cat) {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'cat_sighted',
        title: '목격 신고',
        message: `${cat.name}의 목격 정보가 등록되었습니다.`,
        time: '방금 전',
        isRead: false,
        catName: cat.name,
        userName: currentUserName
      };
      setNotifications(prev => [notification, ...prev]);
    }
  };

  // 인증 관련 핸들러
  const handleLogin = async (userId: string, password: string) => {
    try {
      const response = await apiClient.login({ userId, password });
      if (response.success) {
        setCurrentUser(response.data.user);
        // 토큰을 localStorage에 저장 (실제 프로덕션에서는 더 안전한 방법 사용)
        localStorage.setItem('authToken', response.data.token);
        setShowAuthModal(false);
        alert(`환영합니다, ${response.data.user.displayName}님! 🐱💕`);
        
        // 로그인 후 저장된 동작이 있으면 실행
        if (pendingAction) {
          setTimeout(() => {
            pendingAction();
            setPendingAction(null);
          }, 100); // 짧은 딜레이로 alert가 표시된 후 실행
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      throw new Error(error.message || '로그인에 실패했습니다.');
    }
  };

  const handleRegister = async (userId: string, password: string, email: string, displayName: string) => {
    try {
      const response = await apiClient.register({ userId, password, email, displayName });
      if (response.success) {
        setCurrentUser(response.data.user);
        // 토큰을 localStorage에 저장
        localStorage.setItem('authToken', response.data.token);
        setShowAuthModal(false);
        alert(`가입을 환영합니다, ${response.data.user.displayName}님! 🎉🐱`);
        
        // 회원가입 후 저장된 동작이 있으면 실행
        if (pendingAction) {
          setTimeout(() => {
            pendingAction();
            setPendingAction(null);
          }, 100); // 짧은 딜레이로 alert가 표시된 후 실행
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      throw new Error(error.message || '회원가입에 실패했습니다.');
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      setCurrentUser(null);
      localStorage.removeItem('authToken');
      alert('로그아웃되었습니다. 다음에 또 만나요! 👋🐱');
    } catch (error) {
      // 로그아웃은 실패해도 클라이언트에서 처리
      setCurrentUser(null);
      localStorage.removeItem('authToken');
    }
  };

  const renderContent = () => {
    if (showAddForm) {
      return (
        <AddCatForm
          onSubmit={handleAddCat}
          onCancel={() => {
            setShowAddForm(false);
            setHasFormContent(false);
          }}
          onFormDataChange={setHasFormContent}
        />
      );
    }

    switch (currentView) {
      case 'search':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2>검색 결과</h2>
                <p className="text-muted-foreground">"{searchQuery}" 검색 결과</p>
              </div>
            </div>

            {isSearching ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
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
            ) : searchResults.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((cat) => (
                  <CatCard
                    key={cat.id}
                    cat={cat}
                    onLike={handleCatLike}
                    onComment={handleCatComment}
                    onShare={handleCatShare}
                    onClick={handleCatSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">검색 결과가 없습니다</h3>
                <p className="text-muted-foreground mb-4">
                  "{searchQuery}"와 일치하는 고양이를 찾을 수 없습니다.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView('guide')}
                >
                  전체 고양이 보기
                </Button>
              </div>
            )}
          </div>
        );

      case 'map':
        return (
          <MapView
            cats={cats}
            onCatSelect={handleCatSelect}
          />
        );

      case 'cat-detail':
        if (!detailCat) {
          setCurrentView('home');
          return null;
        }
        return (
          <CatDetail
            cat={detailCat}
            sightingRecords={sightingRecords.filter(s => s.catId === detailCat.id)}
            onBack={() => {
              setDetailCat(null);
              // 이전 화면으로 돌아가기 (map 또는 guide)
              if (currentView === 'cat-detail') {
                // 기본적으로 홈으로 돌아가기
                setCurrentView('home');
              }
            }}
            onLike={handleCatLike}
            onComment={handleCatComment}
            onShare={handleCatShare}
            onSightingReport={handleSightingReport}
          />
        );
        
      case 'post-detail':
        if (!detailPost) {
          setCurrentView('home');
          return null;
        }
        return (
          <CommunityPostDetail
            post={detailPost}
            comments={postComments[detailPost.id] || []}
            onBack={() => {
              setDetailPost(null);
              setCurrentView('home');
            }}
            onLike={() => handlePostLike(detailPost.id)}
            onComment={() => handlePostComment(detailPost.id)}
            onReply={handleReplyComment}
          />
        );

      case 'guide':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                  <span className="text-5xl">📚</span>
                  냥이 도감
                  <span className="text-3xl">🐱</span>
                </h2>
                <p className="text-pink-400 mt-3 text-xl font-medium">우리 동네 모든 냥이들을 만나보세요 💕✨</p>
                <div className="absolute -top-4 -right-12 text-yellow-400 text-3xl animate-bounce">✨</div>
                <div className="absolute -bottom-2 -left-8 text-pink-400 text-2xl animate-pulse">💕</div>
              </div>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card-cute p-6 relative overflow-hidden">
                    {/* Cute Loading Animation */}
                    <div className="absolute inset-0 loading-cute opacity-20"></div>
                    
                    <div className="relative z-10">
                      <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center">
                        <div className="text-4xl animate-bounce" style={{ animationDelay: `${i * 200}ms` }}>
                          🐱
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full w-3/4"></div>
                        <div className="h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-1/2"></div>
                        <div className="h-3 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full w-2/3"></div>
                      </div>
                      
                      {/* Floating sparkles */}
                      <div className="absolute top-2 right-2 text-yellow-400 text-sm animate-ping">✨</div>
                      <div className="absolute bottom-4 left-2 text-pink-400 text-xs animate-pulse">💕</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="card-cute max-w-md mx-auto p-8">
                  <div className="text-6xl mb-4">😿</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">앗, 문제가 발생했어요!</h3>
                  <p className="text-pink-500 mb-6">{error}</p>
                  <Button className="btn-cute btn-cute-primary" onClick={loadCats}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    다시 시도하기
                    <span className="ml-2">🐱</span>
                  </Button>
                </div>
              </div>
            ) : cats.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cats.map((cat) => (
                  <CatCard
                    key={cat.id}
                    cat={cat}
                    onLike={handleCatLike}
                    onComment={handleCatComment}
                    onShare={handleCatShare}
                    onClick={handleCatSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="card-cute max-w-lg mx-auto p-12">
                  <div className="text-8xl mb-6 animate-bounce">🐈</div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
                    아직 냥이가 없어요!
                  </h3>
                  <p className="text-pink-400 text-lg mb-8">우리 동네 첫 번째 냥이를 등록해보세요 💕</p>
                  <Button 
                    className="btn-cute btn-cute-primary text-lg px-8 py-3" 
                    onClick={handleAddCatClick}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    첫 냥이 등록하기
                    <span className="ml-2">🐱✨</span>
                  </Button>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 left-4 text-2xl text-pink-300 animate-pulse">💕</div>
                  <div className="absolute top-8 right-8 text-xl text-purple-300 animate-ping">✨</div>
                  <div className="absolute bottom-6 left-8 text-lg text-yellow-300 animate-bounce">🌟</div>
                  <div className="absolute bottom-4 right-4 text-2xl text-pink-300 animate-pulse">🐾</div>
                </div>
              </div>
            )}
          </div>
        );

      case 'community':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                  <span className="text-5xl">💬</span>
                  커뮤니티
                  <span className="text-3xl">🐱</span>
                </h2>
                <p className="text-pink-400 mt-3 text-xl font-medium">이웃들과 고양이 소식을 공유하세요 💕✨</p>
                <div className="absolute -top-4 -right-12 text-yellow-400 text-3xl animate-bounce">✨</div>
                <div className="absolute -bottom-2 -left-8 text-pink-400 text-2xl animate-pulse">💕</div>
              </div>
              <div className="mt-6">
                <Button className="btn-cute btn-cute-primary text-lg px-8 py-3" onClick={() => {
                  if (!requireLogin('게시글 작성', () => setShowPostForm(true))) return;
                  setShowPostForm(true);
                }}>
                  <Plus className="w-5 h-5 mr-2" />
                  게시글 작성
                  <span className="ml-2">📝✨</span>
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {communityPosts.map((post) => (
                <div key={post.id} className="card-cute border-0 shadow-cute bg-gradient-to-br from-white to-pink-50">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white text-lg font-bold">
                          {post.author.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-bold text-base text-pink-600">{post.author}</span>
                          <span className="text-sm text-purple-500 bg-purple-100 px-2 py-1 rounded-full">{post.time}</span>
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            post.type === 'sighting' ? 'bg-green-100 text-green-600' : 
                            post.type === 'help' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {post.type === 'sighting' ? '👀 목격' : 
                             post.type === 'help' ? '🆘 도움요청' : '📢 업데이트'}
                          </span>
                        </div>
                        
                        <div 
                          className="cursor-pointer hover:bg-pink-50 rounded-lg p-2 -m-2 transition-colors"
                          onClick={() => handlePostSelect(post.id)}
                        >
                          <p className="text-base text-gray-700 mb-4 leading-relaxed hover:text-gray-900 transition-colors">{post.content}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm mb-4">
                          <div 
                            className="flex items-center gap-2 bg-pink-100 px-3 py-1 rounded-full cursor-pointer hover:bg-pink-200 transition-colors"
                            onClick={() => handlePostSelect(post.id)}
                          >
                            <span className="text-pink-600 font-semibold">🐱 {post.catName}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full">
                            <MapPin className="w-4 h-4 text-purple-500" />
                            <span className="text-purple-600 font-medium">{post.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Button 
                            className={`btn-cute h-10 px-4 transition-all duration-300 hover:scale-105 ${
                              post.isLiked 
                                ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-md' 
                                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-red-100 hover:to-pink-100 hover:text-red-500'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePostLike(post.id);
                            }}
                          >
                            <Heart className={`w-4 h-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                            {post.likes} 좋아요
                          </Button>
                          <Button 
                            className="btn-cute bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 hover:from-blue-200 hover:to-purple-200 hover:text-blue-700 h-10 px-4 transition-all duration-300 hover:scale-105"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePostComments(post.id);
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {post.comments} 댓글
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 댓글 섹션 */}
                  {expandedPosts.has(post.id) && (
                    <div className="border-t border-pink-200 bg-gradient-to-br from-pink-25 to-purple-25 p-6">
                      <div className="space-y-4">
                        {/* 댓글 목록 */}
                        {postComments[post.id] && postComments[post.id].length > 0 ? (
                          <div className="space-y-3">
                            {postComments[post.id].map((comment) => (
                              <div key={comment.id} className="bg-white rounded-lg p-4 shadow-sm border border-pink-100">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                                    <span className="text-white text-xs font-bold">
                                      {comment.author.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-purple-600 text-sm">{comment.author}</span>
                                      <span className="text-xs text-pink-400">{comment.time}</span>
                                      {comment.isOwner && (
                                        <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">작성자</span>
                                      )}
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                                    
                                    {/* Reply button */}
                                    <div className="mt-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs text-purple-500 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 h-6"
                                        onClick={() => handleReplyComment(post.id, comment.id)}
                                      >
                                        답글
                                      </Button>
                                    </div>
                                    
                                    {/* Replies */}
                                    {comment.replies && comment.replies.length > 0 && (
                                      <div className="mt-3 ml-4 space-y-2 border-l-2 border-purple-100 pl-3">
                                        {comment.replies.map((reply) => (
                                          <div key={reply.id} className="bg-purple-25 rounded-lg p-3">
                                            <div className="flex items-start gap-2">
                                              <div className="w-6 h-6 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                                                <span className="text-white text-xs font-bold">
                                                  {reply.author.charAt(0)}
                                                </span>
                                              </div>
                                              <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                  <span className="font-semibold text-purple-600 text-xs">{reply.author}</span>
                                                  <span className="text-xs text-pink-400">{reply.time}</span>
                                                  {reply.isOwner && (
                                                    <span className="text-xs bg-pink-100 text-pink-600 px-1 py-0.5 rounded-full">작성자</span>
                                                  )}
                                                </div>
                                                <p className="text-gray-700 text-xs leading-relaxed">{reply.content}</p>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <div className="text-gray-400 text-sm">아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요! 💬</div>
                          </div>
                        )}
                        
                        {/* 댓글 작성 버튼 */}
                        <div className="pt-4 border-t border-pink-100">
                          <Button 
                            className="btn-cute btn-cute-primary w-full py-3"
                            onClick={() => handlePostComment(post.id)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            댓글 작성하기
                            <span className="ml-2">✍️</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default: // home
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                  <span className="text-5xl">🐱</span>
                </div>
                <div className="absolute -top-2 -right-2 text-3xl animate-pulse">💕</div>
                <div className="absolute -bottom-2 -left-2 text-2xl animate-ping">✨</div>
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 bg-clip-text text-transparent mb-3">
                  우리동네 냥이도감
                </h1>
                <p className="text-xl text-pink-400 font-medium">
                  이웃과 함께 만드는 귀여운 길고양이 관찰 플랫폼 🐾💖
                </p>
              </div>
              <Button className="btn-cute btn-cute-primary text-lg px-10 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" onClick={handleAddCatClick}>
                <Plus className="w-6 h-6 mr-2" />
                새 고양이 등록하기
                <span className="ml-2">🌟</span>
              </Button>
            </div>

            {/* Stats Section */}
            <StatsSection stats={getStats(cats.length)} />

            {/* Recent Cats */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                  🐾 최근 등록된 고양이들
                </h2>
                <p className="text-pink-400 text-lg">이웃들이 새로 발견한 귀여운 냥이들 😻✨</p>
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
                  <Button variant="outline" onClick={loadCats}>
                    다시 시도
                  </Button>
                </div>
              ) : cats.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cats.slice(0, 3).map((cat) => (
                    <CatCard
                      key={cat.id}
                      cat={cat}
                      onLike={handleCatLike}
                      onComment={handleCatComment}
                      onShare={handleCatShare}
                      onClick={handleCatSelect}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="card-cute max-w-md mx-auto p-8">
                    <div className="text-6xl mb-4 animate-bounce">😿</div>
                    <p className="text-xl text-pink-500 font-semibold mb-4">아직 등록된 고양이가 없어요!</p>
                    <Button className="btn-cute btn-cute-primary px-6 py-3" onClick={handleAddCatClick}>
                      <Plus className="w-5 h-5 mr-2" />
                      첫 번째 고양이 등록하기
                      <span className="ml-2">🐱</span>
                    </Button>
                  </div>
                </div>
              )}

              {cats.length > 0 && (
                <div className="text-center">
                  <Button 
                    className="btn-cute bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 hover:from-purple-200 hover:to-pink-200 px-8 py-3" 
                    onClick={() => setCurrentView('guide')}
                  >
                    전체 고양이 보기
                    <span className="ml-2">📚</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Recent Community Activity */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                  💬 최근 커뮤니티 소식
                </h2>
                <p className="text-pink-400 text-lg">이웃들의 최신 제보와 귀여운 소식들 🐱💕</p>
              </div>

              <div className="space-y-4">
                {communityPosts.slice(0, 2).map((post) => (
                  <div 
                    key={post.id} 
                    className="card-cute border-0 shadow-cute bg-gradient-to-br from-white to-pink-50 p-5 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    onClick={() => handlePostSelect(post.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-white text-sm font-bold">
                          {post.author.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-pink-600">{post.author}</span>
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                            🐱 {post.catName}
                          </span>
                          <span className="text-xs text-pink-400 ml-auto">{post.time}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed hover:text-gray-900 transition-colors">{post.content}</p>
                        
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-xs bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
                            📍 {post.location}
                          </span>
                          <span className={`text-xs px-3 py-1 rounded-full ${
                            post.type === 'sighting' ? 'bg-green-100 text-green-600' : 
                            post.type === 'help' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {post.type === 'sighting' ? '👀 목격' : 
                             post.type === 'help' ? '🆘 도움' : '📢 소식'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button 
                  className="btn-cute btn-cute-primary px-8 py-3" 
                  onClick={() => setCurrentView('community')}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  더 많은 소식 보기
                  <span className="ml-2">💕</span>
                </Button>
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
        onViewChange={(view) => {
          if (showAddForm) {
            // Header 컴포넌트에서 이미 확인했으므로 바로 변경
            setShowAddForm(false);
            setHasFormContent(false);
          }
          setCurrentView(view);
        }}
        notificationCount={unreadNotificationCount}
        isAddingCat={showAddForm}
        hasFormContent={hasFormContent}
        onAddCatClick={handleAddCatClick}
        onSearch={handleSearch}
        onNotificationClick={handleNotificationClick}
        onAuthClick={() => setShowAuthModal(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative min-h-[calc(100vh-6rem)]">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-4 opacity-10 text-6xl pointer-events-none z-0">🌸</div>
        <div className="absolute top-20 right-8 opacity-10 text-4xl pointer-events-none z-0">🐾</div>
        <div className="absolute bottom-20 left-8 opacity-10 text-5xl pointer-events-none z-0">💕</div>
        <div className="absolute bottom-0 right-4 opacity-10 text-4xl pointer-events-none z-0">✨</div>
        
        <div className="relative z-10">
          {renderContent()}
        </div>
      </main>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onDeleteNotification={handleDeleteNotification}
        onClearAll={handleClearAllNotifications}
      />

      {/* Floating Actions */}
      {!showAddForm && !detailCat && !detailPost && (
        <FloatingActions
          onAddCat={handleAddCatClick}
          onQuickLike={() => {
            if (cats.length > 0) {
              handleCatLike(cats[0].id);
            }
          }}
          onQuickMessage={() => {
            setShowNotifications(true);
          }}
        />
      )}

      {/* Community Post Form */}
      {showPostForm && (
        <CommunityPostForm
          onSubmit={handlePostSubmit}
          onClose={() => setShowPostForm(false)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingAction(null); // 모달 닫을 때 대기 중인 동작 초기화
        }}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}