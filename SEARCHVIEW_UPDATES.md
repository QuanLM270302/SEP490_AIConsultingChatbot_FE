# SearchView Updates - Tab Renaming and Filter Addition

## Summary
User wants to:
1. Rename the 3 permission tabs with better names and descriptions
2. Add search and filter functionality from DocumentsTab (tab 3) to SearchView DOCUMENT_READ tab (tab 1)

## Changes Made

### 1. Updated Imports ✅
- Added `ListDocumentsParams` type
- Added `listCategoriesFlat` and `DocumentCategoryResponse` from categories API
- Added `listTagsActive` and `DocumentTagResponse` from tags API

### 2. Updated Tab Names and Descriptions ✅
Changed in translations object `t`:
- `permissionRead`: "Search & Browse" / "Tìm kiếm & Duyệt"
- `permissionWrite`: "Upload Documents" / "Tải lên tài liệu"  
- `permissionDelete`: "Manage & Delete" / "Quản lý & Xóa"
- `permissionReadDesc`: "Search, filter, and preview documents with advanced filters." / "Tìm kiếm, lọc và xem trước tài liệu với bộ lọc nâng cao."
- `permissionWriteDesc`: "Upload new documents and manage document versions." / "Tải lên tài liệu mới và quản lý phiên bản."
- `permissionDeleteDesc`: "Full document management with delete and restore capabilities." / "Quản lý tài liệu đầy đủ với khả năng xóa và khôi phục."

Added new translations:
- filters, advancedFilters, category, status, fromDate, toDate
- allCategories, allStatuses, statusCompleted, statusPending, statusProcessing, statusFailed
- reset, applyFilters

### 3. Add Filter State Variables (NEEDED)
After `const [sortMode, setSortMode] = useState<SortMode>("newest");` add:

```typescript
// Filter states for advanced search
const [categories, setCategories] = useState<DocumentCategoryResponse[]>([]);
const [tags, setTags] = useState<DocumentTagResponse[]>([]);
const [filterCategoryId, setFilterCategoryId] = useState<string>("");
const [filterTagIds, setFilterTagIds] = useState<string[]>([]);
const [filterStatus, setFilterStatus] = useState<string>("");
const [filterFromDate, setFilterFromDate] = useState<string>("");
const [filterToDate, setFilterToDate] = useState<string>("");
const [showFilters, setShowFilters] = useState<boolean>(false);
```

### 4. Update loadList Function (NEEDED)
Replace the `loadList` function to:
- Accept filter parameters
- Build `ListDocumentsParams` with filters
- Load categories and tags alongside documents
- Update dependencies array to include filter states

### 5. Add Filter UI (NEEDED)
In the DOCUMENT_READ tab section, after the search input, add:
- Filter toggle button (shows active state when filters applied)
- Collapsible filter panel with:
  - Category dropdown
  - Status dropdown  
  - From/To date inputs
  - Tag selection buttons
  - Reset and Apply buttons

## Next Steps
1. Add filter state variables
2. Update loadList function with filter support
3. Add filter UI components in the render section
