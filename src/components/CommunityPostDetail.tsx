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
          className="btn-earthy-secondary w-10 h-10 rounded-full p-0"
        >
          <ArrowLeft className="w-5 h-5" style={{color: 'var(--primary-600)'}} />
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent" style={{background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
          게시글 상세
        </h1>
      </div>

      {/* 게시글 내용 */}
      <div className="card-earthy" style={{background: 'var(--gradient-warm)'}}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md" style={{background: 'var(--gradient-primary)'}}>
              <span className="text-white text-lg font-bold">
                {post.author.charAt(0)}
              </span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-bold text-base" style={{color: 'var(--primary-600)'}}>{post.author}</span>
                <span className="text-sm px-2 py-1 rounded-full" style={{color: 'var(--secondary-600)', background: 'var(--secondary-100)'}}>{post.time}</span>
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
                <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{background: 'var(--primary-100)'}}>
                  <span className="font-semibold" style={{color: 'var(--primary-600)'}}>🐱 {post.catName}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{background: 'var(--secondary-100)'}}>
                  <MapPin className="w-4 h-4" style={{color: 'var(--secondary-500)'}} />
                  <span className="font-medium" style={{color: 'var(--secondary-600)'}}>{post.location}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button 
                  className={`h-10 px-4 transition-all duration-300 hover:scale-105 ${
                    post.isLiked 
                      ? 'btn-earthy-success text-white shadow-md' 
                      : 'btn-earthy-secondary'
                  }`}
                  onClick={() => onLike(post.id)}
                >
                  <Heart className={`w-4 h-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                  {post.likes} 좋아요
                </Button>
                <Button 
                  className="btn-earthy-secondary h-10 px-4 transition-all duration-300 hover:scale-105"
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
      <div className="card-earthy" style={{background: 'var(--gradient-nature)'}}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold" style={{color: 'var(--secondary-600)'}}>
              💬 댓글 {comments.length}개
            </h3>
            <Button 
              className="btn-earthy-primary"
              onClick={() => onComment(post.id)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              댓글 작성
            </Button>
          </div>

          {comments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">💬</div>
              <p style={{color: 'var(--secondary-400)'}}>아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  {/* 원댓글 */}
                  <div className="flex items-start gap-3 p-4 rounded-lg shadow-sm" style={{background: 'var(--neutral-50)'}}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{background: 'var(--gradient-warm)'}}>
                      <User className="w-5 h-5" style={{color: 'var(--primary-600)'}} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold" style={{color: 'var(--primary-700)'}}>{comment.author}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{comment.time}</span>
                        {comment.isOwner && (
                          <Badge className="bg-green-500 text-white text-xs">작성자</Badge>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">{comment.content}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-1 h-auto transition-colors"
                        style={{color: 'var(--secondary-500)'}}
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
                        <div key={reply.id} className="flex items-start gap-3 p-3 rounded-lg" style={{background: 'var(--accent-50)'}}>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{background: 'var(--gradient-secondary)'}}>
                            <User className="w-4 h-4" style={{color: 'white'}} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm" style={{color: 'var(--secondary-600)'}}>{reply.author}</span>
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