# Claude Development Notes for CII RAG Frontend

## Project Overview
Vue.js 3 frontend for CII's LLM-RAG chatbot system with file management capabilities. Uses Vuetify for UI components and integrates with a Python FastAPI backend using ChromaDB for vector storage.

## Build Optimization
The production build has been optimized to reduce bundle sizes and improve loading performance:

### Key Optimizations Applied:
1. **Manual Code Splitting**: Separate chunks for vendor libraries, components, views, and stores
2. **Asset Organization**: Organized by type (images, fonts, JS files)  
3. **CSS Code Splitting**: Enabled for better caching
4. **esbuild Minification**: Faster than terser and adequate for most use cases
5. **Source Maps**: Disabled for production builds

### Build Results:
- **Before**: Large monolithic bundles (795KB CSS, 582KB JS)
- **After**: Chunked assets with better distribution:
  - Main CSS: 673KB (down from 795KB)
  - Main JS: 214KB (down from 582KB)
  - Additional chunks: Components (134KB), Vue vendor (101KB), Views (79KB), Vuetify (57KB)
  - Stores: 1.47KB (very lightweight)

### Build Commands:
- Development: `npm run dev` (runs on port 5173)
- Production: `npm run build`

## Style Guide & Design System

### Color Palette:
- **Primary**: Indigo/Blue (#6366f1, #164f9a)
- **Background**: Light gray (#f8fafc)
- **Cards/Surfaces**: White (#ffffff)
- **Borders**: Light gray (#e5e7eb, #d1d5db)
- **Text**: Dark gray (#111827, #374151, #6b7280)

### Layout Principles:
- **Clean & Minimal**: No gradients, avoid flashy effects
- **Consistent Spacing**: Use 1rem, 1.5rem, 2rem for padding/margins
- **Accessibility**: Proper contrast ratios and readable text sizes
- **Responsive**: Mobile-first approach with proper breakpoints

### Component Styling:
- **Buttons**: Rounded corners (8px-12px), subtle shadows on hover
- **Cards**: White background, subtle border, rounded corners
- **Input Fields**: Clean borders, focus states with indigo accent
- **Chat Messages**: 
  - User: Gray box (#f3f4f6) with border
  - AI: Clean text without background

## Layout Architecture

### Consistent Layout Across Pages:
- **Fixed Height**: 100vh for full-screen experience
- **Sidebar**: Toggleable navigation drawer (300px width, not overlay)
- **App Bar**: Consistent header with logo, title, and logout button
- **Navigation**: Links between Chat and Knowledge Base pages

### ChatView Layout:
- **Main Chat**: Flexible scroll area with fixed input at bottom
- **Input Area**: Always visible at window bottom, not floating
- **Sidebar**: Chat history and navigation links

### ProcessedDocumentsView Layout:
- **Main Content**: Scrollable document management area
- **File Upload**: Integrated file upload component
- **Document List**: Searchable and filterable document display
- **Sidebar**: Navigation links and refresh functionality

### Critical Layout Fix:
**Issue**: Chat input appearing below viewport  
**Solution**: Removed extra spacing in App.vue by setting v-app height to 100vh and overflow hidden

```css
.v-app {
  height: 100vh !important;
  overflow: hidden !important;
}
```

## File Management System

### Supported File Types:
- PDF (.pdf)
- Microsoft Word (.docx)

### Features:
- Drag & drop file upload
- File list with search/filter
- Delete with confirmation dialog
- Real-time status updates
- Error handling and validation

### API Integration:
- Upload: `POST /upload_file`
- Delete: `DELETE /delete_file`
- List: `GET /list_processed_files`

## Known Issues & Fixes

### ChromaDB API Error:
**Error**: "Expected include item to be one of documents, embeddings, metadatas, distances, uris, data, got ids"  
**Fix**: Remove `include=['ids']` parameter from collection.get() calls

### Environment Configuration:
- App title controlled via `VITE_APP_TITLE` in .env file
- API base URL: `VITE_API_BASE_URL=http://localhost:8000`

## Development Commands:
```bash
# Install dependencies
npm install

# Development server (port 5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Future Considerations:
- Monitor bundle sizes as features are added
- Consider lazy loading for additional routes
- Implement service worker for caching
- Add bundle analyzer for detailed size analysis