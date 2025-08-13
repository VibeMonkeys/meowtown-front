import { useState } from 'react';
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
  Plus
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
}

export function AddCatForm({ onSubmit, onCancel }: AddCatFormProps) {
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
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            새로운 고양이 등록
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 사진 업로드 */}
            <div className="space-y-3">
              <Label>사진 (최대 5장)</Label>
              
              {/* 업로드된 이미지 미리보기 */}
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
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
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">사진을 선택하거나 드래그하세요</p>
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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="예: 치즈, 나비, 검둥이"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">추정 나이</Label>
                <Input
                  id="age"
                  value={formData.estimatedAge}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedAge: e.target.value }))}
                  placeholder="예: 2살, 어린고양이, 성체"
                />
              </div>
            </div>

            {/* 성별 */}
            <div className="space-y-3">
              <Label>성별</Label>
              <RadioGroup 
                value={formData.gender} 
                onValueChange={(value: 'male' | 'female' | 'unknown') => 
                  setFormData(prev => ({ ...prev, gender: value }))
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">수컷</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">암컷</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unknown" id="unknown" />
                  <Label htmlFor="unknown">성별 미상</Label>
                </div>
              </RadioGroup>
            </div>

            {/* 중성화 여부 */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>중성화 완료</Label>
                <p className="text-sm text-muted-foreground">TNR이나 수술 확인 시 체크해주세요</p>
              </div>
              <Switch
                checked={formData.isNeutered}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isNeutered: checked }))}
              />
            </div>

            {/* 발견 위치 */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                발견 위치 *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="예: 서초구 반포동 아파트 단지 뒤편"
                required
              />
            </div>

            {/* 설명 */}
            <div className="space-y-2">
              <Label htmlFor="description">특이사항 및 설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="고양이의 행동 특성, 건강 상태, 성격 등을 자유롭게 작성해주세요..."
                rows={3}
              />
            </div>

            {/* 특징 태그 */}
            <div className="space-y-3">
              <Label>특징 태그</Label>
              
              {/* 선택된 특징들 */}
              {formData.characteristics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.characteristics.map((char) => (
                    <Badge key={char} variant="secondary" className="cursor-pointer" onClick={() => removeCharacteristic(char)}>
                      #{char}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}

              {/* 미리 정의된 특징들 */}
              <div className="flex flex-wrap gap-2">
                {predefinedCharacteristics
                  .filter(char => !formData.characteristics.includes(char))
                  .map((char) => (
                    <Badge 
                      key={char} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => addCharacteristic(char)}
                    >
                      #{char}
                      <Plus className="w-3 h-3 ml-1" />
                    </Badge>
                  ))
                }
              </div>

              {/* 커스텀 특징 추가 */}
              <div className="flex gap-2">
                <Input
                  value={newCharacteristic}
                  onChange={(e) => setNewCharacteristic(e.target.value)}
                  placeholder="새로운 특징 추가..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCharacteristic(newCharacteristic))}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => addCharacteristic(newCharacteristic)}
                  disabled={!newCharacteristic.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 제출 버튼들 */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                등록하기
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}