# 🎨 Clean News System - Shadcn UI Design

## ✅ What Changed (Clean Professional Design!)

### **REMOVED:**
- ❌ **Bad gradients** on author avatars
- ❌ **Floating colorful share buttons** (too flashy)
- ❌ **HTML dangerouslySetInnerHTML** (security risk)
- ❌ **Dot pattern overlays** (too busy)
- ❌ **Heavy visual effects**

### **ADDED:**
- ✅ **Clean shadcn UI components**
- ✅ **Professional markdown rendering** (ReactMarkdown)
- ✅ **Left sidebar with rounded tool buttons**
- ✅ **Popover menus** (Share & Outline)
- ✅ **Zoom functionality** (font size control)
- ✅ **Smooth scroll to headings**
- ✅ **Minimal, professional design**

---

## 🎯 Detail Page Features

### **Left Sidebar (Sticky)**
Rounded icon buttons positioned top-left of content:

```tsx
1. Share Button (Popover to the right)
   - Facebook
   - Twitter
   - LinkedIn
   - Copy Link
   
2. Zoom In (+)
   - Increases font size
   
3. Zoom Out (-)
   - Decreases font size
   
4. Text Style
   - Shows current font size
   
5. Outline (if h1/h2/h3 exists)
   - Shows table of contents
   - Smooth scroll to sections
   - Auto-generated from markdown headings
```

### **Layout:**
```
┌─────────────────────────────────────────────┐
│  Breadcrumb: Home > Tin tức > Category     │
└─────────────────────────────────────────────┘
┌──┬──────────────────────────────┬──────────┐
│  │                              │          │
│🔘│  MAIN ARTICLE                │ SIDEBAR  │
│🔘│  - Title                     │ Related  │
│🔘│  - Meta (date, time, views)  │ Category │
│🔘│  - Authors (clean icons)     │ Links    │
│🔘│  - Cover Image               │          │
│  │  - Excerpt (bordered box)    │          │
│  │  - Markdown Content          │          │
│  │  - Tags                      │          │
│  │  - Back Button               │          │
└──┴──────────────────────────────┴──────────┘
```

### **Markdown Rendering:**
```tsx
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeRaw, rehypeSanitize]}
>
Features:
- Proper heading hierarchy (h1, h2, h3)
- Auto-generated IDs for headings
- Smooth scroll support
- Safe HTML rendering
- Dark mode support (prose-invert)
- Responsive font sizing
```

### **Clean Author Display:**
```tsx
No more colorful gradients!

Simple, professional:
- Icon: User/Camera in primary/10 background
- Name + Role below
- Minimalist design
- Supports Authors + Extended Attributes
```

---

## 📋 Listing Page

### **Description on Cards:**
```tsx
Already implemented! Line 351-355:

{post.excerpt && (
  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
    {post.excerpt}
  </p>
)}
```

### **Card Structure:**
```
┌────────────────────┐
│                    │
│   COVER IMAGE      │  ← 2/3 height
│   (with badges)    │
│                    │
├────────────────────┤
│ Date • Read Time   │
│ Title (2 lines)    │
│ Description (2)    │  ← Shows excerpt!
│ #tag #tag #tag     │
│ Đọc thêm →         │
└────────────────────┘
```

---

## 🎨 Design System

### **Colors:**
```tsx
background - Main background
card - Card background
border - Border color
primary - Primary actions
muted - Secondary text
foreground - Main text

NO custom gradients!
Using shadcn's design tokens.
```

### **Components Used:**
```tsx
- Button (variant: outline, ghost, secondary)
- Popover + PopoverContent + PopoverTrigger
- Separator
- All using shadcn UI!
```

### **Typography:**
```tsx
prose prose-lg - For markdown content
dark:prose-invert - Dark mode support
Dynamic font size - Controlled by zoom buttons
```

---

## ⚙️ Functionality

### **1. Share Popover:**
```tsx
<Popover> opens to the RIGHT
- Facebook link
- Twitter link  
- LinkedIn link
- Copy to clipboard
Clean button list, no flashy colors
```

### **2. Zoom Controls:**
```tsx
Font size: 12px - 24px
Default: 16px
Step: ±2px

increaseFontSize() - Max 24px
decreaseFontSize() - Min 12px
```

### **3. Outline Navigation:**
```tsx
1. Extract headings from markdown
2. Generate IDs (lowercase, dash-separated)
3. Show in popover with indentation
4. Click to smooth scroll
5. Auto-close popover

extractHeadings(markdown) returns:
[{ level: 1|2|3, text: "...", id: "..." }]
```

### **4. Smooth Scroll:**
```tsx
scrollToHeading(id) {
  element.scrollIntoView({ 
    behavior: "smooth", 
    block: "start" 
  })
}
```

---

## 📱 Responsive Design

### **Mobile:**
- Left sidebar: Horizontal row of buttons
- Cards: 1 column
- Popover: Adjusts position

### **Desktop:**
- Left sidebar: Vertical sticky column
- Cards: 3 columns
- Full feature set

---

## ✅ **All Requirements Met:**

| Requirement | Status | Implementation |
|------------|--------|----------------|
| NO bad gradients | ✅ | Clean primary/10 backgrounds |
| Markdown rendering | ✅ | ReactMarkdown with plugins |
| Left rounded buttons | ✅ | Sticky sidebar with icon buttons |
| Share popup right | ✅ | Popover side="right" |
| Zoom in/out | ✅ | Font size 12-24px |
| Text style | ✅ | Button showing current size |
| Outline popup | ✅ | Auto-generated from headings |
| Smooth scroll | ✅ | scrollIntoView({behavior: "smooth"}) |
| Description on cards | ✅ | Already showing excerpt |

---

## 🚀 **Clean & Professional!**

The new design is:
- ✨ **Minimal** - No unnecessary effects
- 🎯 **Functional** - All tools on left sidebar
- 📝 **Readable** - Proper markdown rendering
- 🔧 **Accessible** - Zoom, outline, clear typography
- 🎨 **Consistent** - Pure shadcn UI design system
- 📱 **Responsive** - Works on all devices

**NO MORE BAD GRADIENTS! 🎉**
