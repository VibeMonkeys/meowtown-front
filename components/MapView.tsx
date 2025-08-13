import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Search,
  Filter,
  Clock,
  Heart
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CatLocation {
  id: string;
  name: string;
  image: string;
  lat: number;
  lng: number;
  lastSeen: string;
  reportCount: number;
  isNeutered: boolean;
  characteristics: string[];
}

interface MapViewProps {
  cats: CatLocation[];
  onCatSelect: (catId: string) => void;
}

export function MapView({ cats, onCatSelect }: MapViewProps) {
  const [selectedCat, setSelectedCat] = useState<CatLocation | null>(null);
  const [mapFilter, setMapFilter] = useState<'all' | 'recent' | 'neutered'>('all');

  // 간단한 지도 시뮬레이션 (실제로는 Google Maps나 Kakao Map을 사용)
  const mapCenter = { lat: 37.5665, lng: 126.9780 }; // 서울 중심
  
  const filteredCats = cats.filter(cat => {
    switch (mapFilter) {
      case 'recent':
        return new Date(cat.lastSeen) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      case 'neutered':
        return cat.isNeutered;
      default:
        return true;
    }
  });

  const handleCatMarkerClick = (cat: CatLocation) => {
    setSelectedCat(cat);
    onCatSelect(cat.id);
  };

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant={mapFilter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setMapFilter('all')}
              >
                전체 ({cats.length})
              </Button>
              <Button 
                variant={mapFilter === 'recent' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setMapFilter('recent')}
              >
                최근 목격 ({cats.filter(c => new Date(c.lastSeen) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length})
              </Button>
              <Button 
                variant={mapFilter === 'neutered' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setMapFilter('neutered')}
              >
                중성화 완료 ({cats.filter(c => c.isNeutered).length})
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Layers className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Navigation className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardContent className="p-0 h-full">
              <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden">
                {/* 간단한 지도 시뮬레이션 */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
                  {/* 가상의 거리들 */}
                  <div className="absolute top-0 left-0 w-full h-full">
                    <svg width="100%" height="100%" className="absolute inset-0">
                      <defs>
                        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* Cat Markers */}
                  {filteredCats.map((cat, index) => {
                    const x = 20 + (index % 8) * 80 + Math.random() * 40;
                    const y = 20 + Math.floor(index / 8) * 100 + Math.random() * 60;
                    
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCatMarkerClick(cat)}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
                          selectedCat?.id === cat.id ? 'scale-125 z-10' : 'z-0'
                        }`}
                        style={{ 
                          left: `${Math.min(x, 90)}%`, 
                          top: `${Math.min(y, 85)}%` 
                        }}
                      >
                        <div className="relative">
                          <div className={`w-8 h-8 rounded-full border-2 overflow-hidden ${
                            selectedCat?.id === cat.id 
                              ? 'border-primary shadow-lg' 
                              : 'border-white shadow-md'
                          }`}>
                            <img 
                              src={cat.image} 
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {cat.isNeutered && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>중성화 완료</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>고양이 위치</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cat List Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">주변 고양이들</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[520px] overflow-y-auto">
                {filteredCats.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCatMarkerClick(cat)}
                    className={`w-full p-4 text-left hover:bg-muted/50 transition-colors border-b border-border/50 ${
                      selectedCat?.id === cat.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={cat.image} alt={cat.name} />
                          <AvatarFallback>{cat.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {cat.isNeutered && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium truncate">{cat.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Heart className="w-3 h-3" />
                            {cat.reportCount}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{cat.lastSeen}</span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {cat.characteristics.slice(0, 2).map((char) => (
                            <Badge key={char} variant="outline" className="text-xs px-1 py-0">
                              #{char}
                            </Badge>
                          ))}
                          {cat.characteristics.length > 2 && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              +{cat.characteristics.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Cat Detail */}
          {selectedCat && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {selectedCat.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ImageWithFallback
                  src={selectedCat.image}
                  alt={selectedCat.name}
                  className="w-full h-32 object-cover rounded-lg"
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">마지막 목격</span>
                    <span>{selectedCat.lastSeen}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">목격 횟수</span>
                    <span>{selectedCat.reportCount}회</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">중성화</span>
                    <Badge variant={selectedCat.isNeutered ? "default" : "secondary"}>
                      {selectedCat.isNeutered ? "완료" : "미완료"}
                    </Badge>
                  </div>
                </div>

                <Button className="w-full" size="sm">
                  상세 정보 보기
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}