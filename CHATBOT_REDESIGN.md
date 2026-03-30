# 🚀 Chatbot Redesign - Glean Style

## ✨ Tính năng mới

### 1. **Navigation Sidebar** (Glean-style)
- Clean minimal design (14px width)
- Light theme with dark mode support
- 4 sections chính:
  - 💬 **Chat**: AI conversation
  - 🔍 **Search**: Document search (RAG)
  - 📚 **Knowledge**: Browse documents
  - 📊 **Analytics**: Usage insights
- Icon-only navigation with tooltips
- User profile dropdown with logout
- Active indicator (blue accent)

### 2. **Chat View** (Clean & Minimal)
- Giống ChatGPT/Perplexity
- Menu button (3 lines) in top-left corner
- Opens chat history sidebar on click
- No heavy cards
- Clean message bubbles
- Sources hiển thị dưới dạng chips
- Example questions khi bắt đầu
- Smooth animations

### 2.1 **Chat History Sidebar**
- Slides in from left when menu button clicked
- Grouped conversations:
  - Today
  - Past 7 Days
  - Older
- "New Chat" button at top
- Click conversation to load
- Overlay on mobile

### 3. **Search View** (NEW!)
- Large search bar (Glean-style)
- Search results với:
  - Document title
  - Snippet với highlighted text
  - Metadata (department, tags, date)
  - Confidence score
- Document preview panel (right side)
- Click vào result để xem preview

## 🎨 Design System

### Colors
- Background: `#0b0b0c` (dark)
- Accent: `emerald-500` (green)
- Borders: `border-white/10`
- Hover: `bg-white/5`

### Typography
- Clean, readable
- No heavy styling
- Focus on content

### Components
```
components/chat/
├── NavigationSidebar.tsx  ← Sidebar chính
├── ChatView.tsx           ← Chat interface
├── SearchView.tsx         ← Search interface
└── (old components...)
```

## 📁 File Structure

```
app/
└── chatbot-new/
    └── page.tsx           ← Main page (NEW!)

components/chat/
├── NavigationSidebar.tsx  ← Navigation (NEW!)
├── ChatView.tsx           ← Chat view (NEW!)
└── SearchView.tsx         ← Search view (NEW!)
```

## 🔗 Routes

### Mới (Redesigned)
- `/chatbot-new` - New Glean-style interface

### Cũ (Giữ lại)
- `/chatbot` - Old interface (backup)

## 🚀 Cách sử dụng

### 1. Truy cập interface mới
```
http://localhost:3000/chatbot-new
```

### 2. Chuyển đổi giữa Chat và Search
- Click vào **Chat** icon: AI conversation
- Click vào **Search** icon: Document search

### 3. Chat Mode
- Nhập câu hỏi
- AI trả lời với sources
- Click vào source chips để xem tài liệu

### 4. Search Mode
- Nhập từ khóa tìm kiếm
- Xem kết quả với highlighted text
- Click vào result để preview

## 🔧 TODO - Tích hợp API

### Chat View
```typescript
// File: components/chat/ChatView.tsx
// Line: ~45

// TODO: Replace with actual API call
const response = await chat({
  message: input,
  conversationId: conversationId ?? undefined,
  topK: 5,
});
```

### Search View
```typescript
// File: components/chat/SearchView.tsx
// Line: ~35

// TODO: Replace with actual API call
const results = await searchDocuments({
  query: query,
  topK: 10,
});
```

## 📊 So sánh Old vs New

| Feature | Old (/chatbot) | New (/chatbot-new) |
|---------|----------------|-------------------|
| Layout | Dashboard-style | Glean-style |
| Sidebar | Chat history only | Navigation + Views |
| Search | ❌ No | ✅ Yes (separate view) |
| Design | Heavy cards | Clean, minimal |
| Theme | Light/Dark toggle | Dark-first |
| Sources | In message box | Clean chips |
| UX | Admin-like | Product-like |

## 🎯 Điểm mạnh cho đồ án

1. **Dual Mode**: Chat + Search (không chỉ chatbot)
2. **Professional UI**: Glean/Perplexity style
3. **RAG Integration**: Sources hiển thị rõ ràng
4. **Scalable**: Dễ thêm Knowledge Base, Analytics
5. **Modern Stack**: React + Tailwind + TypeScript

## 🔄 Migration Plan

### Phase 1: Testing (Hiện tại)
- Test `/chatbot-new` với mock data
- Gather feedback

### Phase 2: API Integration
- Connect Chat API
- Connect Search API
- Add real document preview

### Phase 3: Replace Old
- Update routes: `/chatbot` → new interface
- Keep old as `/chatbot-legacy`

## 💡 Tips

### Customize Colors
```typescript
// File: components/chat/NavigationSidebar.tsx
// Change accent color from emerald to your brand color

className="bg-emerald-500"  // Change to bg-blue-500, etc.
```

### Add More Views
```typescript
// File: app/chatbot-new/page.tsx
// Add new view in activeView state

const [activeView, setActiveView] = useState<
  "chat" | "search" | "knowledge" | "analytics" | "YOUR_NEW_VIEW"
>("chat");
```

## ✅ Status Update

### Completed ✅
- ✅ Clean Glean-style navigation sidebar (14px width, icons only)
- ✅ Chat view with menu button (3 lines) to open chat history
- ✅ Chat history sidebar with grouped conversations (Today, Past 7 Days, Older)
- ✅ Search view with document search interface
- ✅ **Knowledge Base view** with full document management
  - Upload documents with 4 visibility options (Company Wide, By Department, By Role, By Department AND Role)
  - **Fetch all data from API**: categories, tags, departments, roles
  - **Interactive button selection** for tags, departments, and roles (not text input)
  - **Dropdown selection** for categories
  - Delete documents (soft delete)
  - Version history tracking
  - Update document versions
  - Conditional department/role selectors based on visibility
- ✅ All TypeScript errors fixed
- ✅ Fixed hydration mismatch in NavigationSidebar
- ✅ Fixed type mismatch for DocumentVisibility in API
- ✅ Removed unused imports
- ✅ Proper component integration
- ✅ Mock data for testing

### Pending ⏳
- ⏳ API integration for chat messages
- ⏳ API integration for document search
- ⏳ Implement actual download functionality (backend needs download URL)
- ⏳ Analytics view implementation
- ⏳ Real document preview content

## 📝 Notes

- Design inspired by: Glean, Perplexity, ChatGPT
- Focus: Clean, minimal, AI-first
- Target: Enterprise workplace assistant
- NOT: Admin dashboard style

---

**Created**: 2024
**Status**: ✅ Ready for testing
**Next**: API integration
