# Carousel Content WebApp — CLAUDE.md

## Project Stack

- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM (HashRouter)
- **AI**: Google Gemini API (`@google/genai`)
- **Animation**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Deploy**: GitHub Pages (`base: '/AI-Util-WebApp/'`)

## Skills

Trước khi thực hiện bất kỳ task nào, hãy xác định skill liên quan và **đọc file skill đó** tại `.claude/skills/<skill-name>/SKILL.md`.

## | Skill | Công dụng | Chức năng | Trường hợp sử dụng (Đọc khi nào) |

| `vibe-code-workflow` | Core | Phương pháp luận vibe coding — cách cộng tác với AI để build phần mềm. Bao gồm vòng lặp Define → Generate → Review → Test → Refine, cách viết prompt hiệu quả, và cách chia nhỏ project thành từng phần AI-friendly. | Bắt đầu project mới, không biết nên tiếp cận bài toán từ đâu, cần lập kế hoạch trước khi code, hoặc muốn cải thiện cách viết prompt cho AI. |
| `react-component` | Frontend | Tạo React component chất lượng production — functional components, hooks (useState, useEffect, custom hooks), patterns như composition, conditional rendering, forms, lists. Kèm checklist accessibility. | Tạo bất kỳ component UI nào (form, modal, card, table, list, sidebar, header), refactor component cũ, hoặc gặp vấn đề với hooks. Tạo component, UI element, form, modal, hook, refactor component |
| `tailwind-styling` | Frontend | Styling chuyên sâu với Tailwind CSS — hệ thống class cho layout, typography, color, borders, shadows, animations. Kèm code mẫu cho card, button, input, navbar, dark mode. | Styling, layout, màu sắc, animation, responsive => Cần styling bất kỳ element nào, muốn UI trông chuyên nghiệp, làm dark mode, thêm animation/hover effects, hoặc chọn color palette. |
| `responsive-design` | Frontend | Layout responsive mobile-first — breakpoints, grid/flexbox strategies, responsive nav với hamburger menu, responsive typography/spacing, hide/show theo screen size. | Layout cần hoạt động trên mobile và desktop, layout bị vỡ trên mobile/tablet, cần làm navigation responsive, xây layout sidebar, hoặc bất cứ khi nào cần UI hoạt động trên mọi kích thước màn hình. |
| `state-management` | Frontend | Quản lý state trong React — từ useState (local) → useReducer (complex) → Context API (shared) → Zustand (global). Kèm decision framework giúp chọn đúng tool cho từng trường hợp. | Chia sẻ state giữa components, global state, cần share data giữa nhiều component, gặp prop drilling, cần global state (cart, theme, auth), hoặc không biết nên dùng useState hay Context hay Zustand. |
| `nextjs-fullstack` | Full-stack | Build web app full-stack với Next.js App Router — project structure, Server vs Client Components, routing, data fetching, Server Actions, API routes, SEO metadata, environment variables. | Tạo web app/website mới, cần routing giữa các trang, fetch data từ server, xử lý form submission, hoặc cấu hình SEO/metadata. |
| `supabase-backend` | Full-stack | Backend hoàn chỉnh với Supabase — database CRUD, authentication (email, OAuth), file storage, real-time subscriptions, Row Level Security (RLS). Không cần viết backend server. | Cần database, hệ thống đăng nhập/đăng ký, upload file/ảnh, real-time data sync, hoặc bất cứ khi nào cần backend cho app. |
| `api-integration` | Full-stack | Gọi API & xử lý dữ liệu — fetch patterns, custom hooks cho data fetching, TanStack Query (caching/deduplication), error handling strategy, pagination (offset & cursor-based). | Gọi API từ bên ngoài, xử lý loading/error states, fetch, implement pagination hoặc infinite scroll, hoặc cần caching strategy cho data. |
| `auth-flow` | Full-stack | Authentication end-to-end — Auth Context, protected routes, Next.js middleware guard, login/signup form pattern, OAuth social login. Kèm security checklist. | Trang login/signup, bảo vệ route chỉ user đăng nhập mới truy cập được, implement "remember me", hoặc thêm đăng nhập bằng Google/GitHub. |
| `typescript-patterns` | Tools | TypeScript thực dụng cho React — typing props, events, hooks, API responses. Patterns: discriminated unions, Pick/Omit/Partial, generic functions, type-safe fetch wrapper. | Gặp type error, cần type cho component/hook/API response, muốn thay thế "any", hoặc cần AI sinh code TypeScript chính xác hơn. |
| `debug-helper` | Tools | Debugging có hệ thống — giải mã error messages phổ biến (React, TypeScript, Next.js, build errors), chiến lược console.log, checklist cho từng loại bug (data undefined, UI không update, styling lỗi, infinite loop). | Gặp lỗi, bug, crash, unexpected behavior, màn hình trắng, behavior không đúng, build fail, hoặc bất cứ khi nào "nó không chạy" mà chưa biết tại sao. |
| `project-setup` | Tools | Khởi tạo project từ đầu — scaffolding commands, cấu trúc thư mục chuẩn, naming conventions, tsconfig, .env, .gitignore, essential packages, tiện ích cn(). Kèm deploy checklist. | Bắt đầu project mới, cấu hình TypeScript/Tailwind/ESLint, chọn cấu trúc thư mục, cần biết cài package gì, hoặc chuẩn bị deploy lên Vercel. |
| `react-native-mobile` | Mobile | Build app iOS/Android với React Native + Expo — component mapping (View, Text, FlatList), StyleSheet, NativeWind (Tailwind cho RN), Expo Router navigation, platform-specific code, build & deploy với EAS. | Tạo app mobile, chuyển từ web sang mobile, cần navigation (tabs, stack), xử lý khác biệt iOS/Android, hoặc build app để đưa lên App Store/Play Store. |

Có thể đọc nhiều skill cùng lúc nếu task liên quan đến nhiều lĩnh vực.

## Coding Conventions

- Dùng functional components và hooks, không dùng class components
- Dùng TypeScript types rõ ràng, tránh `any`
- Ưu tiên Tailwind utility classes, không viết CSS tách biệt
- Component nhỏ, single responsibility
- Không tự commit/push — người dùng tự quyết định khi nào push
