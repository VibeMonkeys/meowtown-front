import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Heart, 
  MessageSquare, 
  MapPin, 
  Reply,
  User
} from 'lucide-react';
import { CommunityPost, CommunityComment } from '../api';

interface CommunityPostDetailProps {
  post: CommunityPost;
  comments: CommunityComment[];
  onBack: () => void;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onReply: (postId: string, parentCommentId: string) => void;
}

export function CommunityPostDetail({ 
  post, 
  comments,
  onBack, 
  onLike, 
  onComment,
  onReply 
}: CommunityPostDetailProps) {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="btn-cute bg-white/80 dark:bg-gray-700/80 hover:bg-pink-50 dark:hover:bg-pink-900/30 border border-pink-200 dark:border-pink-600 w-10 h-10 rounded-full p-0"
        >
          <ArrowLeft className="w-5 h-5 text-pink-600 dark:text-pink-400" />
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          게시글 상세
        </h1>
      </div>

      {/* 게시글 내용 */}
      <div className="card-cute border-0 shadow-cute bg-gradient-to-br from-white to-pink-50 dark:from-gray-800 dark:to-gray-700">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-lg font-bold">
                {post.author.charAt(0)}
              </span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-bold text-base text-pink-600 dark:text-pink-400">{post.author}</span>
                <span className="text-sm text-purple-500 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded-full">{post.time}</span>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  post.type === 'sighting' ? 'bg-green-100 text-green-600' : 
                  post.type === 'help' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {post.type === 'sighting' ? '👀 목격' : 
                   post.type === 'help' ? '🆘 도움요청' : '📢 업데이트'}
                </span>
              </div>
              
              <p className="text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              
              <div className="flex items-center gap-4 text-sm mb-4">
                <div className="flex items-center gap-2 bg-pink-100 dark:bg-pink-900/50 px-3 py-1 rounded-full">
                  <span className="text-pink-600 dark:text-pink-400 font-semibold">🐱 {post.catName}</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/50 px-3 py-1 rounded-full">
                  <MapPin className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                  <span className="text-purple-600 dark:text-purple-400 font-medium">{post.location}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button 
                  className={`btn-cute h-10 px-4 transition-all duration-300 hover:scale-105 ${
                    post.isLiked 
                      ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-md' 
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-600 dark:text-gray-300 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/30 dark:hover:to-pink-900/30 hover:text-red-500 dark:hover:text-red-400'
                  }`}
                  onClick={() => onLike(post.id)}
                >
                  <Heart className={`w-4 h-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                  {post.likes} 좋아요
                </Button>
                <Button 
                  className="btn-cute bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 hover:from-blue-200 hover:to-purple-200 dark:hover:from-blue-800/50 dark:hover:to-purple-800/50 hover:text-blue-700 dark:hover:text-blue-300 h-10 px-4 transition-all duration-300 hover:scale-105"
                  onClick={() => onComment(post.id)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {comments.length} 댓글
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="card-cute border-0 shadow-cute bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400">
              💬 댓글 {comments.length}개
            </h3>
            <Button 
              className="btn-cute btn-cute-primary"
              onClick={() => onComment(post.id)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              댓글 작성
            </Button>
          </div>

          {comments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-pink-400 dark:text-pink-300">아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  {/* 원댓글 */}
                  <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-700/50 rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-pink-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-purple-700 dark:text-purple-300">{comment.author}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{comment.time}</span>
                        {comment.isOwner && (
                          <Badge className="bg-green-500 text-white text-xs">작성자</Badge>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">{comment.content}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-900/30 p-1 h-auto"
                        onClick={() => onReply(post.id, comment.id)}
                      >
                        <Reply className="w-3 h-3 mr-1" />
                        답글
                      </Button>
                    </div>
                  </div>

                  {/* 대댓글들 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-8 space-y-2">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-purple-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-purple-600 dark:text-purple-400 text-sm">{reply.author}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{reply.time}</span>
                              {reply.isOwner && (
                                <Badge className="bg-green-500 text-white text-xs">작성자</Badge>
                              )}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}