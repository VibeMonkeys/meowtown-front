# MeowTown Cute Design System

This document outlines the standardized design system components for the MeowTown project, ensuring consistent UI/UX across the application.

## Design Principles

1. **Cute & Friendly**: Soft rounded corners, playful gradients, and gentle hover effects
2. **Accessible**: WCAG compliant colors, proper touch targets (44px minimum), and keyboard navigation
3. **Mobile-First**: Touch-friendly interactions and responsive design
4. **Consistent**: Standardized spacing, colors, and typography

## Button Components

### CuteButton

The primary button component with standardized variants and sizes.

```tsx
import { CuteButton, PrimaryButton, SecondaryButton, IconButton } from './ui';

// Basic usage with variants
<CuteButton cuteVariant="primary" cuteSize="lg">주요 버튼</CuteButton>
<CuteButton cuteVariant="secondary">보조 버튼</CuteButton>
<CuteButton cuteVariant="outline">아웃라인 버튼</CuteButton>
<CuteButton cuteVariant="ghost">고스트 버튼</CuteButton>
<CuteButton cuteVariant="danger">위험 버튼</CuteButton>
<CuteButton cuteVariant="success">성공 버튼</CuteButton>

// Pre-configured variants
<PrimaryButton cuteSize="xl">큰 주요 버튼</PrimaryButton>
<SecondaryButton>보조 버튼</SecondaryButton>
<IconButton cuteVariant="ghost" cuteSize="sm">
  <Heart className="w-4 h-4" />
</IconButton>

// Action buttons for CTAs
<ActionButton onClick={handleSubmit}>등록하기</ActionButton>
<CompactButton cuteVariant="ghost">작은 버튼</CompactButton>
```

### Button Sizes

- `xs`: 24px height, for very compact spaces
- `sm`: 32px height, for secondary actions
- `md`: 40px height, default size
- `lg`: 44px height, WCAG compliant touch target
- `xl`: 48px height, for primary CTAs

### Button Variants

- `primary`: Pink gradient, for main actions
- `secondary`: Light background, for secondary actions
- `outline`: Transparent with border, for alternate actions
- `ghost`: Semi-transparent, for subtle actions
- `danger`: Red gradient, for destructive actions
- `success`: Green gradient, for positive actions

## Card Components

### CuteCard

The primary card component with elevation and interaction variants.

```tsx
import { CuteCard, InteractiveCard, ElevatedCard, ContentCard } from './ui';

// Basic usage
<CuteCard cuteSize="lg" cuteBorder="primary">
  <CardContent>카드 내용</CardContent>
</CuteCard>

// Interactive card (clickable)
<InteractiveCard onClick={handleClick}>
  클릭 가능한 카드
</InteractiveCard>

// Pre-configured variants
<ElevatedCard>높은 그림자가 있는 카드</ElevatedCard>
<FlatCard>평평한 카드</FlatCard>
<InfoCard>정보 카드 (파란 테두리)</InfoCard>
<SuccessCard>성공 카드 (초록 테두리)</SuccessCard>
<WarningCard>경고 카드 (노란 테두리)</WarningCard>
<DangerCard>위험 카드 (빨간 테두리)</DangerCard>

// Content card with automatic spacing
<ContentCard 
  title="카드 제목"
  footer={<PrimaryButton>액션</PrimaryButton>}
>
  카드 내용이 자동으로 올바른 패딩을 가집니다.
</ContentCard>
```

### Card Sizes

- `sm`: 1rem padding, compact spaces
- `md`: 1.5rem padding, default size
- `lg`: 2rem padding, hero content

### Card Variants

- `default`: Standard cute card with hover effects
- `flat`: Minimal shadow, subtle appearance
- `elevated`: Higher shadow, prominent appearance
- `interactive`: Clickable with scale effects

### Card Borders

- `none`: No border (default)
- `default`: Light pink border
- `primary`: Pink border for info
- `success`: Green border for success states
- `warning`: Yellow border for warnings
- `danger`: Red border for errors

## Design Tokens

### Colors

All colors follow the cute theme with pink/purple gradients:

```css
--primary-400: #f472b6 (Main pink)
--primary-500: #ec4899 (Darker pink)
--primary-600: #db2777 (Darkest pink)
```

### Spacing

Consistent spacing scale:

```css
--spacing-xs: 0.25rem (4px)
--spacing-sm: 0.5rem (8px)
--spacing-md: 1rem (16px)
--spacing-lg: 1.5rem (24px)
--spacing-xl: 2rem (32px)
```

### Border Radius

Cute rounded corners:

```css
--border-radius-sm: 0.5rem
--border-radius-md: 0.75rem
--border-radius-lg: 1rem
--border-radius-xl: 1.5rem
--border-radius-full: 9999px
```

### Shadows

Soft, dreamy shadows:

```css
--shadow-sm: Subtle shadow for elements
--shadow-md: Standard shadow for cards
--shadow-lg: Elevated shadow for modals
--shadow-cute: Special pink-tinted shadow
```

## Accessibility Features

### Focus States

All interactive elements have visible focus indicators:

```css
.btn-cute:focus {
  outline: 2px solid var(--primary-400);
  outline-offset: 2px;
}
```

### Touch Targets

Minimum 44px touch targets for mobile:

```css
.btn-cute-lg {
  min-height: 44px;
  min-width: 44px;
}
```

### Keyboard Navigation

All interactive cards support keyboard navigation:

```tsx
<InteractiveCard onClick={handleClick}>
  // Automatically supports Enter and Space key activation
</InteractiveCard>
```

## Mobile Optimizations

### Touch Feedback

Enhanced touch feedback for mobile devices:

```css
@media (max-width: 768px) {
  .btn-cute:active {
    transform: scale(0.95);
  }
}
```

### Font Size

Prevents iOS zoom on form inputs:

```css
.text-mobile-optimized {
  font-size: 16px; /* iOS에서 줌 방지 */
}
```

## Usage Guidelines

### Do's ✅

- Use `PrimaryButton` for main actions
- Use `InteractiveCard` for clickable content
- Apply consistent spacing with design tokens
- Use semantic button variants (`danger` for delete actions)
- Include proper ARIA labels for accessibility

### Don'ts ❌

- Don't mix custom CSS with cute design system
- Don't use inconsistent button sizes in the same context
- Don't forget hover states for interactive elements
- Don't use colors outside the design system palette
- Don't create touch targets smaller than 44px on mobile

## Migration Guide

To migrate existing components to the new design system:

1. Replace `btn-cute` classes with `<CuteButton>` component
2. Replace `card-cute` classes with `<CuteCard>` component
3. Use pre-configured variants instead of custom CSS classes
4. Update imports to use the new components
5. Test accessibility and mobile interactions

### Before (Old)

```tsx
<Button className="btn-cute btn-cute-primary text-lg px-8 py-3">
  등록하기
</Button>
```

### After (New)

```tsx
<ActionButton onClick={handleSubmit}>
  등록하기
</ActionButton>
```

This standardization ensures consistent design, better accessibility, and easier maintenance across the entire MeowTown application.