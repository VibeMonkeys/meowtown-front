import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, MapPin, X, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';
import { Textarea } from '../../../shared/ui/textarea';
import { Label } from '../../../shared/ui/label';
import { Badge } from '../../../shared/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui/select';
import { Checkbox } from '../../../shared/ui/checkbox';
import type { CatRegistrationForm } from '../../../shared/types';
import { CAT_CHARACTERISTICS, AGE_OPTIONS, GENDER_OPTIONS } from '../../../shared/config/constants';
import { validateImageFile, resizeImage } from '../../../shared/lib/utils';

interface AddCatFormProps {
  onSubmit: (data: CatRegistrationForm) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AddCatForm({ onSubmit, onCancel, isLoading = false }: AddCatFormProps) {
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CatRegistrationForm>();

  const coordinates = watch('coordinates');

  // 특성 추가/제거
  const toggleCharacteristic = (characteristic: string) => {
    setSelectedCharacteristics(prev => {
      const newCharacteristics = prev.includes(characteristic)
        ? prev.filter(c => c !== characteristic)
        : [...prev, characteristic];
      
      setValue('characteristics', newCharacteristics);
      return newCharacteristics;
    });
  };

  // 이미지 파일 선택 핸들러
  const handleImageSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    const previews: string[] = [];

    for (const file of Array.from(files)) {
      if (!validateImageFile(file)) {
        alert(`${file.name}은(는) 유효하지 않은 파일입니다.`);
        continue;
      }

      try {
        const resizedFile = await resizeImage(file);
        validFiles.push(resizedFile);
        
        const previewUrl = URL.createObjectURL(resizedFile);
        previews.push(previewUrl);
      } catch (error) {
        console.error('이미지 처리 실패:', error);
        alert(`${file.name} 처리 중 오류가 발생했습니다.`);
      }
    }

    setImages(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [...prev, ...previews]);
    setValue('images', [...images, ...validFiles]);
  }, [images, setValue]);

  // 이미지 제거
  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    
    const newImages = images.filter((_, i) => i !== index);
    setValue('images', newImages);
  };

  // 현재 위치 가져오기
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('위치 서비스를 지원하지 않는 브라우저입니다.');
      return;
    }

    setLocationLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setValue('coordinates', { lat: latitude, lng: longitude });
        setLocationLoading(false);
      },
      (error) => {
        console.error('위치 가져오기 실패:', error);
        alert('위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [setValue]);

  const onFormSubmit = (data: CatRegistrationForm) => {
    if (selectedCharacteristics.length === 0) {
      alert('고양이의 특성을 최소 1개 이상 선택해주세요.');
      return;
    }

    if (images.length === 0) {
      alert('고양이 사진을 최소 1장 이상 추가해주세요.');
      return;
    }

    onSubmit({
      ...data,
      characteristics: selectedCharacteristics,
      images,
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>새 고양이 등록</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* 고양이 이름 */}
          <div className="space-y-2">
            <Label htmlFor="name">고양이 이름 *</Label>
            <Input
              id="name"
              placeholder="예: 치즈, 나비"
              {...register('name', { 
                required: '고양이 이름을 입력해주세요.',
                minLength: { value: 1, message: '이름을 입력해주세요.' }
              })}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* 위치 정보 */}
          <div className="space-y-2">
            <Label htmlFor="location">발견 위치 *</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                placeholder="예: 서초구 반포동 래미안 아파트"
                className="flex-1"
                {...register('location', { 
                  required: '발견 위치를 입력해주세요.' 
                })}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={getCurrentLocation}
                disabled={locationLoading}
              >
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
            {coordinates && (
              <p className="text-xs text-muted-foreground">
                좌표: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </p>
            )}
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location.message}</p>
            )}
          </div>

          {/* 고양이 정보 */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>성별</Label>
              <Select onValueChange={(value) => setValue('gender', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="성별 선택" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>추정 나이</Label>
              <Select onValueChange={(value) => setValue('estimatedAge', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="나이 선택" />
                </SelectTrigger>
                <SelectContent>
                  {AGE_OPTIONS.map((age) => (
                    <SelectItem key={age} value={age}>
                      {age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isNeutered"
                  onCheckedChange={(checked) => setValue('isNeutered', checked === true)}
                />
                <Label htmlFor="isNeutered" className="text-sm">
                  중성화됨
                </Label>
              </div>
            </div>
          </div>

          {/* 설명 */}
          <div className="space-y-2">
            <Label htmlFor="description">고양이 설명 *</Label>
            <Textarea
              id="description"
              placeholder="고양이의 특징, 성격, 행동 등을 자세히 설명해주세요."
              rows={4}
              {...register('description', { 
                required: '고양이 설명을 입력해주세요.',
                minLength: { value: 10, message: '10자 이상 입력해주세요.' }
              })}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* 특성 선택 */}
          <div className="space-y-2">
            <Label>고양이 특성 *</Label>
            <div className="flex flex-wrap gap-2">
              {CAT_CHARACTERISTICS.map((characteristic) => (
                <Badge
                  key={characteristic}
                  variant={selectedCharacteristics.includes(characteristic) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleCharacteristic(characteristic)}
                >
                  {characteristic}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              선택된 특성: {selectedCharacteristics.length}개
            </p>
          </div>

          {/* 이미지 업로드 */}
          <div className="space-y-2">
            <Label>고양이 사진 *</Label>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 w-6 h-6"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              
              <label className="w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                <Camera className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-1">사진 추가</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </label>
            </div>
            
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WebP 파일만 업로드 가능 (최대 5MB)
            </p>
          </div>

          {/* 버튼들 */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              취소
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? '등록 중...' : '고양이 등록하기'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}