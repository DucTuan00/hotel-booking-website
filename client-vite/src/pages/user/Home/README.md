# Hotel Boutique Website - Design Documentation

## Overview
Đây là tài liệu thiết kế cho website Hotel Boutique Lion, được phát triển với React, TypeScript, TailwindCSS và Ant Design.

## Design System

### Color Palette
- **Primary Gold**: #D4902A (Màu vàng chính từ logo)
- **Secondary Red**: #8B1A1A (Màu đỏ đậm từ thiết kế)
- **Neutral**: Các màu xám từ #F9FAFB đến #111827

### Typography
- **Primary Font**: Playfair Display (serif) - Dành cho tiêu đề
- **Secondary Font**: Inter (sans-serif) - Dành cho nội dung
- **Font Sizes**: Từ 0.75rem (12px) đến 3.75rem (60px)

### Layout Structure
- **Header Height**: 80px
- **Container Max Width**: 1200px
- **Section Padding**: 4rem vertical (responsive)

## Component Architecture

### Reusable Components (src/components/)
- **Header**: Navigation bar với transparent overlay
- **Footer**: Thông tin liên hệ và social media

### Page-specific Components (src/pages/user/Home/components/)
- **HeroSection**: Banner chính với booking form
- **RoomsSection**: Hiển thị phòng với animation scroll
- **ServicesSection**: Dịch vụ spa và tiện ích
- **ToursSection**: Tour du lịch
- **TestimonialsSection**: Đánh giá khách hàng

## Animations & Effects

### Scroll Animations
- **Rooms Section**: 
  - Title: Fade in down với delay 200ms
  - Images: Fade in up với delay 400ms & 600ms
- **Intersection Observer**: Trigger animations khi scroll đến section

### Hover Effects
- **Images**: Scale 1.05-1.1 với transition 300-500ms
- **Cards**: Transform translateY(-5px) với shadow
- **Buttons**: Transform translateY(-2px) với shadow glow

## Responsive Design

### Breakpoints
- **xs**: 475px
- **sm**: 640px  
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Typography Scale (Mobile)
- H1: 2rem (mobile) → 2.5rem (tablet) → 3rem+ (desktop)
- H2: 1.75rem (mobile) → 2rem (tablet) → 2.5rem+ (desktop)

## Image Assets
- Sử dụng Unsplash demo images cho development
- Tối ưu cho responsive với object-cover
- Lazy loading được implement

## Performance Considerations
- **CSS**: Custom styles trong Home.css
- **Fonts**: Google Fonts được preload
- **Images**: Optimized sizes và lazy loading
- **Animations**: Hardware-accelerated transforms

## Browser Support
- Modern browsers với ES6+ support
- CSS Grid và Flexbox
- IntersectionObserver API
- CSS custom properties

## Development Notes
- **Component tái sử dụng**: Header, Footer trong /components
- **Component đặc thù**: Trong /pages/user/Home/components
- **Constants**: Centralized trong /config/constants.ts
- **Styling**: TailwindCSS + Custom CSS + Ant Design
- **State Management**: React useState + useEffect
- **Type Safety**: Full TypeScript implementation

## File Structure
```
src/
├── components/           # Reusable components
│   ├── Header/
│   └── Footer/
├── config/
│   └── constants.ts      # Design system constants
├── pages/user/Home/
│   ├── index.tsx         # Main Home component
│   ├── Home.css          # Custom styles
│   └── components/       # Home-specific components
│       ├── HeroSection.tsx
│       ├── RoomsSection.tsx
│       ├── ServicesSection.tsx
│       ├── ToursSection.tsx
│       └── TestimonialsSection.tsx
```

## Future Enhancements
1. **Performance**: Image optimization với next/image equivalent
2. **Accessibility**: ARIA labels và keyboard navigation
3. **SEO**: Meta tags và structured data
4. **Analytics**: Event tracking cho user interactions
5. **Internationalization**: Multi-language support
6. **API Integration**: Dynamic content từ backend
