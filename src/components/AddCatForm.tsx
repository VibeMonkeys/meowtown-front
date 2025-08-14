import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Switch } from './ui/switch';
import { 
  Upload, 
  MapPin, 
  Calendar, 
  Camera,
  X,
  Plus,
  Sparkles
} from 'lucide-react';

interface CatFormData {
  name: string;
  description: string;
  location: string;
  estimatedAge: string;
  gender: 'male' | 'female' | 'unknown';
  isNeutered: boolean;
  characteristics: string[];
  images: File[];
}

interface AddCatFormProps {
  onSubmit: (data: CatFormData) => void;
  onCancel: () => void;
  onFormDataChange?: (hasContent: boolean) => void;
}

export function AddCatForm({ onSubmit, onCancel, onFormDataChange }: AddCatFormProps) {
  const [formData, setFormData] = useState<CatFormData>({
    name: '',
    description: '',
    location: '',
    estimatedAge: '',
    gender: 'unknown',
    isNeutered: false,
    characteristics: [],
    images: []
  });

  const [newCharacteristic, setNewCharacteristic] = useState('');
  
  // 폼에 내용이 있는지 확인
  useEffect(() => {
    const hasContent = 
      formData.name !== '' ||
      formData.description !== '' ||
      formData.location !== '' ||
      formData.estimatedAge !== '' ||
      formData.characteristics.length > 0 ||
      formData.images.length > 0;
    
    onFormDataChange?.(hasContent);
  }, [formData, onFormDataChange]);

  const predefinedCharacteristics = [
    '삼색이', '치즈', '턱시도', '검정', '회색', '갈색',
    '긴털', '짧은털', '파란눈', '노란눈', '헤테로크로미아',
    '귀끝잘림', '목걸이착용', '친근함', '경계심많음', '활발함'
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5) // 최대 5장
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addCharacteristic = (characteristic: string) => {
    if (characteristic && !formData.characteristics.includes(characteristic)) {
      setFormData(prev => ({
        ...prev,
        characteristics: [...prev.characteristics, characteristic]
      }));
    }
    setNewCharacteristic('');
  };

  const removeCharacteristic = (characteristic: string) => {
    setFormData(prev => ({
      ...prev,
      characteristics: prev.characteristics.filter(c => c !== characteristic)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      {/* Floating Decorations */}
      <div className="absolute -top-4 -left-4 text-pink-300 text-2xl animate-bounce" style={{ animationDelay: '0s' }}>🌸</div>
      <div className="absolute -top-6 right-8 text-purple-300 text-xl animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
      <div className="absolute top-1/4 -right-6 text-yellow-300 text-lg animate-bounce" style={{ animationDelay: '1s' }}>🐾</div>
      
      <Card className="card-cute overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-100">
          <CardTitle className="flex items-center gap-3 text-pink-600">
            <div className="relative">
              <Camera className="w-6 h-6" />
              <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400" />
            </div>
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-bold text-xl">
              새로운 냥이 등록 🐱💕
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="bg-gradient-to-br from-white to-pink-25 p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 사진 업로드 */}
            <div className="space-y-4">
              <Label className="text-pink-600 font-semibold flex items-center gap-2">
                📸 사진 (최대 5장)
                <span className="text-xs bg-pink-100 text-pink-500 px-2 py-1 rounded-full">필수</span>
              </Label>
              
              {/* 업로드된 이미지 미리보기 */}
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="relative overflow-hidden rounded-xl border-2 border-pink-200 shadow-md hover:shadow-lg transition-all duration-300">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* 업로드 버튼 */}
              {formData.images.length < 5 && (
                <div>
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-pink-300 rounded-xl cursor-pointer bg-gradient-to-br from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                    <div className="flex flex-col items-center justify-center pt-6 pb-6">
                      <div className="relative mb-3">
                        <Upload className="w-10 h-10 text-pink-400 group-hover:text-pink-500 transition-colors" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full flex items-center justify-center animate-pulse">
                          <Sparkles className="w-2 h-2 text-yellow-600" />
                        </div>
                      </div>
                      <p className="text-sm text-pink-600 font-medium mb-1">💕 사진을 선택하거나 드래그하세요</p>
                      <p className="text-xs text-purple-500">귀여운 냥이의 모습을 보여주세요! 🐱</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* 기본 정보 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-pink-600 font-semibold flex items-center gap-2">
                  🏷️ 이름
                  <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded-full">필수</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="예: 치즈, 나비, 검둥이 💝"
                  className="input-cute text-mobile-optimized min-h-[44px]"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="age" className="text-pink-600 font-semibold flex items-center gap-2">
                  🎂 추정 나이
                </Label>
                <Input
                  id="age"
                  value={formData.estimatedAge}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedAge: e.target.value }))}
                  placeholder="예: 2살, 어린고양이, 성체 🐱"
                  className="input-cute text-mobile-optimized min-h-[44px]"
                />
              </div>
            </div>

            {/* 성별 */}
            <div className="space-y-4">
              <Label className="text-pink-600 font-semibold flex items-center gap-2">
                🚻 성별
              </Label>
              <RadioGroup 
                value={formData.gender} 
                onValueChange={(value: 'male' | 'female' | 'unknown') => 
                  setFormData(prev => ({ ...prev, gender: value }))
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-colors cursor-pointer min-h-[44px]">
                  <RadioGroupItem value="male" id="male" className="text-blue-500" />
                  <Label htmlFor="male" className="text-blue-600 font-medium cursor-pointer flex items-center gap-1">
                    ♂️ 수컷
                  </Label>
                </div>
                <div className="flex items-center space-x-3 bg-pink-50 p-4 rounded-xl border-2 border-pink-200 hover:border-pink-300 transition-colors cursor-pointer min-h-[44px]">
                  <RadioGroupItem value="female" id="female" className="text-pink-500" />
                  <Label htmlFor="female" className="text-pink-600 font-medium cursor-pointer flex items-center gap-1">
                    ♀️ 암컷
                  </Label>
                </div>
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors cursor-pointer min-h-[44px]">
                  <RadioGroupItem value="unknown" id="unknown" className="text-gray-500" />
                  <Label htmlFor="unknown" className="text-gray-600 font-medium cursor-pointer flex items-center gap-1">
                    ❓ 성별 미상
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* 중성화 여부 */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Label className="text-green-600 font-semibold flex items-center gap-2">
                    ✂️ 중성화 완료
                  </Label>
                  <p className="text-sm text-green-500">TNR이나 수술 확인 시 체크해주세요 💚</p>
                </div>
                <Switch
                  checked={formData.isNeutered}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isNeutered: checked }))}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </div>

            {/* 발견 위치 */}
            <div className="space-y-3">
              <Label htmlFor="location" className="text-pink-600 font-semibold flex items-center gap-2">
                📍 발견 위치
                <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded-full">필수</span>
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="예: 서초구 반포동 아파트 단지 뒤편 🏠"
                className="input-cute"
                required
              />
            </div>

            {/* 설명 */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-pink-600 font-semibold flex items-center gap-2">
                📝 특이사항 및 설명
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="고양이의 행동 특성, 건강 상태, 성격 등을 자유롭게 작성해주세요... 💝🐱"
                rows={4}
                className="input-cute resize-none"
              />
            </div>

            {/* 특징 태그 */}
            <div className="space-y-4">
              <Label className="text-pink-600 font-semibold flex items-center gap-2">
                🏷️ 특징 태그
                <span className="text-xs text-purple-500">선택사항</span>
              </Label>
              
              {/* 선택된 특징들 */}
              {formData.characteristics.length > 0 && (
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <p className="text-sm text-purple-600 font-medium mb-3 flex items-center gap-1">
                    ✨ 선택된 특징들
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.characteristics.map((char) => (
                      <Badge 
                        key={char} 
                        className="bg-gradient-to-r from-purple-400 to-pink-400 text-white cursor-pointer hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-105 shadow-md"
                        onClick={() => removeCharacteristic(char)}
                      >
                        #{char}
                        <X className="w-3 h-3 ml-2 hover:bg-white/20 rounded-full" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 미리 정의된 특징들 */}
              <div className="bg-pink-25 p-4 rounded-xl border border-pink-200">
                <p className="text-sm text-pink-600 font-medium mb-3 flex items-center gap-1">
                  🎨 추천 특징들 (클릭해서 추가하세요!)
                </p>
                <div className="flex flex-wrap gap-2">
                  {predefinedCharacteristics
                    .filter(char => !formData.characteristics.includes(char))
                    .map((char) => (
                      <Badge 
                        key={char} 
                        className="bg-white border-2 border-pink-200 text-pink-600 cursor-pointer hover:bg-pink-100 hover:border-pink-300 transition-all duration-300 hover:scale-105 shadow-sm"
                        onClick={() => addCharacteristic(char)}
                      >
                        #{char}
                        <Plus className="w-3 h-3 ml-1" />
                      </Badge>
                    ))
                  }
                </div>
              </div>

              {/* 커스텀 특징 추가 */}
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="text-sm text-yellow-600 font-medium mb-3 flex items-center gap-1">
                  ✏️ 나만의 특징 추가하기
                </p>
                <div className="flex gap-3">
                  <Input
                    value={newCharacteristic}
                    onChange={(e) => setNewCharacteristic(e.target.value)}
                    placeholder="새로운 특징을 입력해주세요... 🌟"
                    className="input-cute flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCharacteristic(newCharacteristic))}
                  />
                  <Button 
                    type="button" 
                    className="btn-cute bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500 px-4 py-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                    onClick={() => addCharacteristic(newCharacteristic)}
                    disabled={!newCharacteristic.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* 제출 버튼들 */}
            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                className="btn-cute btn-cute-primary flex-1 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span className="mr-2">🐱</span>
                등록하기
                <span className="ml-2">💕</span>
              </Button>
              <Button 
                type="button" 
                className="btn-cute btn-cute-secondary px-6 py-4 text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={onCancel}
              >
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}