import type { Cat, SearchFilters } from '../../../shared/types';
import { formatTimeAgo, calculateDistance } from '../../../shared/lib/utils';

export class CatModel {
  constructor(private data: Cat) {}

  get id() { return this.data.id; }
  get name() { return this.data.name; }
  get image() { return this.data.image; }
  get location() { return this.data.location; }
  get lastSeen() { return this.data.lastSeen; }
  get description() { return this.data.description; }
  get characteristics() { return this.data.characteristics; }
  get reportedBy() { return this.data.reportedBy; }
  get likes() { return this.data.likes; }
  get comments() { return this.data.comments; }
  get isNeutered() { return this.data.isNeutered; }
  get estimatedAge() { return this.data.estimatedAge; }
  get gender() { return this.data.gender; }
  get coordinates() { return { lat: this.data.lat, lng: this.data.lng }; }
  get reportCount() { return this.data.reportCount; }

  /**
   * 마지막 목격 시간을 상대적 시간으로 포맷팅
   */
  getFormattedLastSeen(): string {
    return formatTimeAgo(this.data.lastSeen);
  }

  /**
   * 성별을 한국어로 표시
   */
  getGenderLabel(): string {
    switch (this.data.gender) {
      case 'male': return '수컷';
      case 'female': return '암컷';
      default: return '성별 모름';
    }
  }

  /**
   * 중성화 상태를 한국어로 표시
   */
  getNeuteredLabel(): string {
    return this.data.isNeutered ? '중성화됨' : '중성화 안됨';
  }

  /**
   * 특정 위치로부터의 거리 계산
   */
  getDistanceFrom(lat: number, lng: number): number {
    return calculateDistance(lat, lng, this.data.lat, this.data.lng);
  }

  /**
   * 고양이가 검색 필터와 일치하는지 확인
   */
  matchesFilters(filters: SearchFilters): boolean {
    // 위치 필터
    if (filters.location && !this.data.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    // 성별 필터
    if (filters.gender && this.data.gender !== filters.gender) {
      return false;
    }

    // 중성화 상태 필터
    if (filters.isNeutered !== undefined && this.data.isNeutered !== filters.isNeutered) {
      return false;
    }

    // 특성 필터
    if (filters.characteristics && filters.characteristics.length > 0) {
      const hasMatchingCharacteristic = filters.characteristics.some(char => 
        this.data.characteristics.some(catChar => 
          catChar.toLowerCase().includes(char.toLowerCase())
        )
      );
      if (!hasMatchingCharacteristic) {
        return false;
      }
    }

    // 날짜 범위 필터 (lastSeen 기준)
    if (filters.dateRange) {
      const lastSeenDate = new Date(this.data.lastSeen);
      if (lastSeenDate < filters.dateRange.from || lastSeenDate > filters.dateRange.to) {
        return false;
      }
    }

    return true;
  }

  /**
   * 고양이 정보를 요약 텍스트로 변환
   */
  getSummary(): string {
    const parts = [];
    
    if (this.data.estimatedAge) {
      parts.push(this.data.estimatedAge);
    }
    
    parts.push(this.getGenderLabel());
    
    if (this.data.isNeutered) {
      parts.push('중성화됨');
    }
    
    if (this.data.characteristics.length > 0) {
      parts.push(this.data.characteristics.slice(0, 3).join(', '));
    }
    
    return parts.join(' · ');
  }

  /**
   * 고양이의 활동성 점수 계산 (최근 목격 횟수, 좋아요, 댓글 수 기반)
   */
  getActivityScore(): number {
    const now = new Date();
    const lastSeenDate = new Date(this.data.lastSeen);
    const daysSinceLastSeen = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let score = 0;
    
    // 최근 목격 가점
    if (daysSinceLastSeen === 0) score += 10;
    else if (daysSinceLastSeen <= 3) score += 5;
    else if (daysSinceLastSeen <= 7) score += 2;
    
    // 좋아요 가점
    score += Math.min(this.data.likes * 0.5, 20);
    
    // 댓글 가점
    score += Math.min(this.data.comments * 1, 15);
    
    // 제보 횟수 가점
    score += Math.min(this.data.reportCount * 0.3, 10);
    
    return Math.round(score);
  }

  /**
   * 원본 데이터 반환
   */
  toJSON(): Cat {
    return { ...this.data };
  }

  /**
   * 데이터 업데이트
   */
  update(updates: Partial<Cat>): CatModel {
    return new CatModel({ ...this.data, ...updates });
  }

  /**
   * 좋아요 증가
   */
  incrementLikes(): CatModel {
    return new CatModel({ ...this.data, likes: this.data.likes + 1 });
  }

  /**
   * 좋아요 감소
   */
  decrementLikes(): CatModel {
    return new CatModel({ ...this.data, likes: Math.max(0, this.data.likes - 1) });
  }

  /**
   * 댓글 수 업데이트
   */
  updateCommentCount(count: number): CatModel {
    return new CatModel({ ...this.data, comments: Math.max(0, count) });
  }
}

/**
 * Cat 배열을 CatModel 배열로 변환
 */
export function createCatModels(cats: Cat[]): CatModel[] {
  return cats.map(cat => new CatModel(cat));
}

/**
 * 고양이 목록을 다양한 기준으로 정렬
 */
export function sortCats(cats: CatModel[], sortBy: 'name' | 'lastSeen' | 'likes' | 'activity' | 'distance', order: 'asc' | 'desc' = 'desc', referencePoint?: { lat: number; lng: number }): CatModel[] {
  return [...cats].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name, 'ko');
        break;
      case 'lastSeen':
        comparison = new Date(a.lastSeen).getTime() - new Date(b.lastSeen).getTime();
        break;
      case 'likes':
        comparison = a.likes - b.likes;
        break;
      case 'activity':
        comparison = a.getActivityScore() - b.getActivityScore();
        break;
      case 'distance':
        if (referencePoint) {
          const distanceA = a.getDistanceFrom(referencePoint.lat, referencePoint.lng);
          const distanceB = b.getDistanceFrom(referencePoint.lat, referencePoint.lng);
          comparison = distanceA - distanceB;
        }
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * 고양이 목록을 필터링
 */
export function filterCats(cats: CatModel[], filters: SearchFilters): CatModel[] {
  return cats.filter(cat => cat.matchesFilters(filters));
}