import { Card, CardContent, CardHeader } from './card';

interface CuteSkeletonProps {
  className?: string;
  variant?: 'cat-card' | 'cat-detail' | 'community-post' | 'header' | 'stats';
  count?: number;
}

export function CuteSkeleton({ className = '', variant = 'cat-card', count = 1 }: CuteSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const CatCardSkeleton = ({ index }: { index: number }) => (
    <Card key={index} className={`card-cute overflow-hidden ${className}`}>
      <CardContent className="p-0">
        {/* Image Skeleton with floating cute elements */}
        <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="text-4xl animate-bounce opacity-60"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              🐱
            </div>
          </div>
          {/* Floating sparkles */}
          <div className="absolute top-2 right-2 text-lg animate-ping opacity-40">✨</div>
          <div className="absolute bottom-2 left-2 text-sm animate-pulse opacity-40">💕</div>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-effect"></div>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-white to-pink-25">
          {/* Name skeleton */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full w-24 animate-pulse"></div>
            <div className="text-lg">🐱</div>
          </div>
          
          {/* Location skeleton */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-purple-200 rounded-full animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-32 animate-pulse"></div>
          </div>
          
          {/* Stats skeleton */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-200 rounded-full animate-pulse"></div>
              <div className="h-4 bg-green-200 rounded-full w-12 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-purple-200 rounded-full animate-pulse"></div>
              <div className="h-4 bg-purple-200 rounded-full w-16 animate-pulse"></div>
            </div>
          </div>
          
          {/* Tags skeleton */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[1, 2, 3].map((tag) => (
              <div 
                key={tag} 
                className="h-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full w-12 animate-pulse"
                style={{ animationDelay: `${tag * 100}ms` }}
              ></div>
            ))}
          </div>
          
          {/* Action buttons skeleton */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="h-10 bg-gradient-to-r from-red-100 to-pink-100 rounded-full w-20 animate-pulse"></div>
              <div className="h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-16 animate-pulse"></div>
            </div>
            <div className="h-10 w-10 bg-gradient-to-r from-green-100 to-blue-100 rounded-full animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CatDetailSkeleton = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-12 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full w-32 animate-pulse"></div>
        <div className="flex items-center gap-3">
          <div className="h-8 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full w-40 animate-pulse"></div>
          <div className="text-2xl">🐱</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content skeleton */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="card-cute overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-80 bg-gradient-to-br from-pink-100 to-purple-100 animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl animate-bounce opacity-60">🐱</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-effect"></div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="h-8 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full w-48 animate-pulse"></div>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl animate-pulse"></div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-full animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-1/2 animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-8">
          <Card className="card-cute">
            <CardHeader>
              <div className="h-6 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-32 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-36 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl mb-4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-full animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full w-2/3 animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const CommunityPostSkeleton = ({ index }: { index: number }) => (
    <Card key={index} className={`card-cute border-0 shadow-cute bg-gradient-to-br from-white to-pink-50 ${className}`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full animate-pulse flex-shrink-0"></div>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-4 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full w-24 animate-pulse"></div>
              <div className="h-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-16 animate-pulse"></div>
              <div className="h-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-full w-12 animate-pulse"></div>
            </div>
            
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-pink-200 rounded-full w-full animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-pink-200 to-gray-200 rounded-full w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-pink-200 rounded-full w-1/2 animate-pulse"></div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-8 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full w-20 animate-pulse"></div>
              <div className="h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-16 animate-pulse"></div>
            </div>
            
            <div className="flex gap-4">
              <div className="h-8 bg-gradient-to-r from-red-100 to-pink-100 rounded-full w-24 animate-pulse"></div>
              <div className="h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const HeaderSkeleton = () => (
    <div className="sticky top-0 z-50 card-cute backdrop-blur border-b-0 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo skeleton */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-5 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full w-24 animate-pulse"></div>
              <div className="h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-20 animate-pulse"></div>
            </div>
          </div>

          {/* Search skeleton */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="h-12 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full w-full animate-pulse"></div>
          </div>

          {/* Actions skeleton */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block h-11 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full w-32 animate-pulse"></div>
            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full animate-pulse"></div>
            <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Mobile search skeleton */}
        <div className="md:hidden pb-3">
          <div className="h-10 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg w-full animate-pulse"></div>
        </div>
      </div>

      {/* Navigation skeleton */}
      <div className="hidden md:block border-t border-pink-100 bg-gradient-to-r from-pink-25 to-purple-25">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-1 h-16">
            {[1, 2, 3, 4].map((item) => (
              <div 
                key={item} 
                className="h-10 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full w-24 animate-pulse"
                style={{ animationDelay: `${item * 100}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const StatsSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {[1, 2, 3, 4, 5, 6].map((stat) => (
        <Card key={stat} className="card-cute text-center">
          <CardContent className="p-6">
            <div 
              className="text-4xl mb-2 animate-bounce"
              style={{ animationDelay: `${stat * 100}ms` }}
            >
              {stat === 1 ? '🐱' : stat === 2 ? '✨' : stat === 3 ? '👥' : stat === 4 ? '✂️' : stat === 5 ? '👁️' : '📸'}
            </div>
            <div className="h-8 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-16 mx-auto animate-pulse"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  switch (variant) {
    case 'cat-card':
      return (
        <>
          {skeletons.map((index) => (
            <CatCardSkeleton key={index} index={index} />
          ))}
        </>
      );
    
    case 'cat-detail':
      return <CatDetailSkeleton />;
    
    case 'community-post':
      return (
        <>
          {skeletons.map((index) => (
            <CommunityPostSkeleton key={index} index={index} />
          ))}
        </>
      );
    
    case 'header':
      return <HeaderSkeleton />;
    
    case 'stats':
      return <StatsSkeleton />;
    
    default:
      return (
        <>
          {skeletons.map((index) => (
            <CatCardSkeleton key={index} index={index} />
          ))}
        </>
      );
  }
}