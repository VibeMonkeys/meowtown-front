import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  X,
  UserPlus,
  LogIn,
  Check
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userId: string, password: string) => Promise<void>;
  onRegister: (userId: string, password: string, email: string, displayName: string) => Promise<void>;
}

export function AuthModal({ isOpen, onClose, onLogin, onRegister }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
    email: '',
    displayName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await onLogin(formData.userId, formData.password);
        onClose();
        setFormData({ userId: '', password: '', confirmPassword: '', email: '', displayName: '' });
      } else {
        if (!formData.email || !formData.displayName) {
          setError('모든 필드를 입력해주세요.');
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('비밀번호가 일치하지 않습니다.');
          return;
        }
        await onRegister(formData.userId, formData.password, formData.email, formData.displayName);
        
        // 회원가입 성공 애니메이션
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setFormData({ userId: '', password: '', confirmPassword: '', email: '', displayName: '' });
          setIsSuccess(false);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setFormData({ userId: '', password: '', confirmPassword: '', email: '', displayName: '' });
  };

  if (!isOpen) return null;

  // 회원가입 성공 화면
  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        
        {/* Success Modal */}
        <div className="relative w-full max-w-md mx-4">
          <Card className="card-cute border-2 border-green-200 shadow-2xl overflow-hidden bg-gradient-to-br from-green-50 to-pink-50">
            <CardContent className="p-8 text-center">
              <div className="relative">
                {/* 성공 아이콘 애니메이션 */}
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <Check className="w-10 h-10 text-white animate-pulse" />
                </div>
                
                {/* 폭죽 효과 */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none">
                  <div className="animate-ping text-4xl">🎉</div>
                </div>
                <div className="absolute top-4 left-8 pointer-events-none">
                  <div className="animate-bounce text-2xl" style={{ animationDelay: '0.2s' }}>✨</div>
                </div>
                <div className="absolute top-4 right-8 pointer-events-none">
                  <div className="animate-bounce text-2xl" style={{ animationDelay: '0.4s' }}>🌟</div>
                </div>
                
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  🎊 회원가입 완료! 🎊
                </h2>
                
                <p className="text-lg text-gray-700 mb-2">
                  환영합니다! 🐱
                </p>
                
                <p className="text-base text-gray-600">
                  이제 MeowTown에서 귀여운 고양이들을 만나보세요! 💕
                </p>
                
                {/* 하트 애니메이션 */}
                <div className="flex justify-center gap-2 mt-6">
                  <span className="text-2xl animate-pulse" style={{ animationDelay: '0s' }}>💖</span>
                  <span className="text-2xl animate-pulse" style={{ animationDelay: '0.3s' }}>💕</span>
                  <span className="text-2xl animate-pulse" style={{ animationDelay: '0.6s' }}>💖</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4">
        <Card className="card-cute border-2 border-pink-200 shadow-2xl overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 opacity-60">
            <div className="sparkle" style={{ animationDelay: '0s' }}></div>
            <div className="sparkle" style={{ animationDelay: '0.3s', top: '10px', left: '15px' }}></div>
          </div>
          <div className="absolute top-4 right-4 opacity-60">
            <div className="text-2xl animate-pulse">💕</div>
          </div>
          
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 opacity-80"></div>
          
          <CardHeader className="relative z-10 bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  {mode === 'login' ? (
                    <LogIn className="w-6 h-6 text-white" />
                  ) : (
                    <UserPlus className="w-6 h-6 text-white" />
                  )}
                </div>
                <CardTitle className="text-2xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-bold">
                  {mode === 'login' ? '🐱 로그인' : '🌟 회원가입'}
                </CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="btn-cute bg-white/80 hover:bg-red-50 text-gray-600 hover:text-red-500 border border-red-200 w-8 h-8 rounded-full transition-all duration-300 hover:scale-110"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User ID */}
              <div className="space-y-3">
                <Label htmlFor="userId" className="text-pink-600 font-semibold text-sm flex items-center gap-2">
                  👤 아이디
                </Label>
                <Input
                  id="userId"
                  type="text"
                  value={formData.userId}
                  onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                  placeholder="아이디를 입력하세요"
                  className="input-cute h-12 text-base bg-white/70 backdrop-blur-sm border-2 border-pink-200 focus:border-pink-400 rounded-xl pl-4 pr-4"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-pink-600 font-semibold text-sm flex items-center gap-2">
                  🔒 비밀번호
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="비밀번호를 입력하세요"
                  className="input-cute h-12 text-base bg-white/70 backdrop-blur-sm border-2 border-pink-200 focus:border-pink-400 rounded-xl pl-4 pr-4"
                  required
                />
              </div>

              {/* Confirm Password (Register only) */}
              {mode === 'register' && (
                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-pink-600 font-semibold text-sm flex items-center gap-2">
                    🔐 비밀번호 확인
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="비밀번호를 다시 입력하세요"
                    className="input-cute h-12 text-base bg-white/70 backdrop-blur-sm border-2 border-pink-200 focus:border-pink-400 rounded-xl pl-4 pr-4"
                    required
                  />
                </div>
              )}

              {/* Email (Register only) */}
              {mode === 'register' && (
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-pink-600 font-semibold text-sm flex items-center gap-2">
                    📧 이메일
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="이메일을 입력하세요"
                    className="input-cute h-12 text-base bg-white/70 backdrop-blur-sm border-2 border-pink-200 focus:border-pink-400 rounded-xl pl-4 pr-4"
                    required
                  />
                </div>
              )}

              {/* Display Name (Register only) */}
              {mode === 'register' && (
                <div className="space-y-3">
                  <Label htmlFor="displayName" className="text-pink-600 font-semibold text-sm flex items-center gap-2">
                    ✨ 닉네임
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="닉네임을 입력하세요"
                    className="input-cute h-12 text-base bg-white/70 backdrop-blur-sm border-2 border-pink-200 focus:border-pink-400 rounded-xl pl-4 pr-4"
                    required
                  />
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium">❌ {error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>처리 중...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {mode === 'login' ? (
                        <>
                          👤 ✨ 로그인하기 🐱
                        </>
                      ) : (
                        <>
                          👤 ✨ 회원가입하기 🐱
                        </>
                      )}
                    </div>
                  )}
                </Button>
              </div>

              {/* Mode Switch */}
              <div className="text-center pt-6 border-t border-pink-100 mt-6">
                <p className="text-purple-600 mb-4 font-medium">
                  {mode === 'login' ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
                </p>
                <Button 
                  type="button"
                  onClick={switchMode}
                  variant="outline"
                  className="px-8 py-3 bg-white hover:bg-pink-50 border-2 border-pink-300 hover:border-pink-400 text-pink-600 hover:text-pink-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  {mode === 'login' ? (
                    <>🌟 회원가입하기</>
                  ) : (
                    <>🐱 로그인하기</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}