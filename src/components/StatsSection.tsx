import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Users, 
  MapPin, 
  Heart, 
  Camera,
  TrendingUp,
  Shield
} from 'lucide-react';

interface StatsData {
  totalCats: number;
  newCatsThisWeek: number;
  activeCaregivers: number;
  neutralizedCats: number;
  totalSightings: number;
  photosUploaded: number;
}

interface StatsSectionProps {
  stats: StatsData;
}

export function StatsSection({ stats }: StatsSectionProps) {
  const neutralizationRate = Math.round((stats.neutralizedCats / stats.totalCats) * 100);

  const statCards = [
    {
      title: '등록된 고양이',
      value: stats.totalCats,
      subtitle: `이번 주 +${stats.newCatsThisWeek}마리`,
      icon: Heart,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50'
    },
    {
      title: '활동 중인 캣맘',
      value: stats.activeCaregivers,
      subtitle: '지역 돌봄이',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: '중성화 완료',
      value: stats.neutralizedCats,
      subtitle: `전체의 ${neutralizationRate}%`,
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: '이번 달 목격',
      value: stats.totalSightings,
      subtitle: '제보 건수',
      icon: MapPin,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Neutralization Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              중성화 현황
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">전체 진행률</span>
                <span className="text-sm font-medium">{neutralizationRate}%</span>
              </div>
              <Progress value={neutralizationRate} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <p className="text-lg font-semibold text-green-600">{stats.neutralizedCats}</p>
                <p className="text-xs text-muted-foreground">완료</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-orange-600">
                  {stats.totalCats - stats.neutralizedCats}
                </p>
                <p className="text-xs text-muted-foreground">필요</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              커뮤니티 활동
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">업로드된 사진</span>
              </div>
              <span className="text-sm font-medium">{stats.photosUploaded.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">목격 제보</span>
              </div>
              <span className="text-sm font-medium">{stats.totalSightings.toLocaleString()}</span>
            </div>

            <div className="pt-2">
              <Badge variant="secondary" className="w-full justify-center">
                이번 주 활동도 ⭐⭐⭐⭐
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}