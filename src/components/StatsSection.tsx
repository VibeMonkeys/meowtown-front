import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Users, 
  MapPin, 
  Heart, 
  Camera,
  TrendingUp,
  Shield,
  Sparkles
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
      emoji: '🐱',
      value: stats.totalCats,
      subtitle: `이번 주 +${stats.newCatsThisWeek}마리`,
      icon: Heart,
      gradient: 'from-pink-400 to-rose-500',
      bgGradient: 'from-white to-pink-25',
      borderColor: 'border-pink-500'
    },
    {
      title: '활동 중인 캣맘',
      emoji: '👥',
      value: stats.activeCaregivers,
      subtitle: '지역 돌봄이',
      icon: Users,
      gradient: 'from-blue-400 to-indigo-500',
      bgGradient: 'from-white to-purple-25',
      borderColor: 'border-blue-500'
    },
    {
      title: '중성화 완료',
      emoji: '🛡️',
      value: stats.neutralizedCats,
      subtitle: `전체의 ${neutralizationRate}%`,
      icon: Shield,
      gradient: 'from-green-400 to-emerald-500',
      bgGradient: 'from-white to-green-25',
      borderColor: 'border-green-500'
    },
    {
      title: '이번 달 목격',
      emoji: '📍',
      value: stats.totalSightings,
      subtitle: '제보 건수',
      icon: MapPin,
      gradient: 'from-purple-400 to-violet-500',
      bgGradient: 'from-white to-purple-25',
      borderColor: 'border-purple-500'
    }
  ];

  return (
    <div className="space-y-8 relative">
      {/* Decorative Elements */}
      <div className="absolute -top-2 -left-2 text-2xl text-pink-300 animate-bounce" style={{ animationDelay: '0s' }}>✨</div>
      <div className="absolute -top-4 right-4 text-xl text-purple-300 animate-bounce" style={{ animationDelay: '0.5s' }}>🌟</div>
      
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <Card key={index} className={`card-cute relative overflow-hidden border-2 ${stat.borderColor} hover:scale-105 transition-all duration-300 group bg-gradient-to-br ${stat.bgGradient}`}>
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-90`}></div>
              
              {/* Sparkle Effects */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="sparkle" style={{ animationDelay: `${index * 0.2}s` }}></div>
              </div>
              
              <CardContent className="p-5 relative z-10">
                <div className="text-center space-y-3">
                  {/* Icon Section */}
                  <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-full shadow-lg opacity-90`}></div>
                    <div className="relative flex items-center justify-center">
                      <span className="text-2xl">{stat.emoji}</span>
                      <Icon className="w-4 h-4 text-white absolute bottom-0 right-0" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{stat.title}</p>
                    <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium mt-2 bg-gray-100/80 dark:bg-black/50 px-2 py-1 rounded-full">
                      {stat.subtitle}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Neutralization Progress */}
        <Card className="card-cute border-2 border-green-500 relative overflow-hidden bg-gradient-to-br from-white to-green-25">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white to-green-25 opacity-90"></div>
          
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-green-600 dark:text-green-400">
              <div className="relative">
                <Shield className="w-6 h-6" />
                <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400" />
              </div>
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-bold text-xl">
                🛡️ 중성화 현황
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">💚 전체 진행률</span>
                <span className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {neutralizationRate}%
                </span>
              </div>
              {/* Custom Progress Bar */}
              <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-gray-300 dark:border-gray-600 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-inner"
                  style={{ width: `${neutralizationRate}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">{neutralizationRate}% 완료! 🎉</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="text-center bg-green-100/80 dark:bg-black/40 p-4 rounded-xl border border-green-500">
                <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {stats.neutralizedCats}
                </p>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">✅ 완료</p>
              </div>
              <div className="text-center bg-orange-100/80 dark:bg-black/40 p-4 rounded-xl border border-orange-500">
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  {stats.totalCats - stats.neutralizedCats}
                </p>
                <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">⏳ 필요</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Activity */}
        <Card className="card-cute border-2 border-blue-500 relative overflow-hidden bg-gradient-to-br from-white to-purple-25">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white to-purple-25 opacity-90"></div>
          
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
              <div className="relative">
                <TrendingUp className="w-6 h-6" />
                <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400" />
              </div>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold text-xl">
                📊 커뮤니티 활동
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 relative z-10">
            <div className="bg-blue-100/80 dark:bg-black/40 p-4 rounded-xl border border-blue-500 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">📸 업로드된 사진</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                {stats.photosUploaded.toLocaleString()}
              </span>
            </div>
            
            <div className="bg-purple-100/80 dark:bg-black/40 p-4 rounded-xl border border-purple-500 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">📍 목격 제보</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                {stats.totalSightings.toLocaleString()}
              </span>
            </div>

            <div className="pt-2">
              <Badge className="w-full justify-center py-3 text-base bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                이번 주 활동도 ⭐⭐⭐⭐⭐ 💪
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}