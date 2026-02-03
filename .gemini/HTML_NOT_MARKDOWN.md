# 🔧 HTML Rendering - NOT Markdown!

## ⚠️ IMPORTANT: Content is HTML, NOT Markdown!

### **The Confusion:**
TipTap is a **rich text editor** that stores content as **HTML** (not Markdown).
- ❌ NOT Markdown → Don't use ReactMarkdown
- ✅ IS HTML → Use `dangerouslySetInnerHTML`

---

## 🎯 How TipTap Works

### **TipTap Editor:**
```
User types → TipTap Editor → Saves as HTML
```

**Example TipTap Output:**
```html
<h1>Title</h1>
<p>This is a <a href="..." class="text-primary underline">link</a></p>
<figure data-type="image-block" class="image-block align-center">
  <img src="..." alt="..." />
  <figcaption><span class="caption">Photo caption</span></figcaption>
</figure>
```

### **What We Need to Do:**
```
HTML from server → Render with dangerouslySetInnerHTML → Display on page
```

---

## ✅ CORRECT Implementation

### **1. Detail Page (`[slug]/page.tsx`)**

**Excerpt (HTML):**
```tsx
{post.excerpt && (
  <div 
    className="text-lg leading-relaxed italic text-muted-foreground"
    dangerouslySetInnerHTML={{ __html: post.excerpt }}
  />
)}
```

**Content (HTML):**
```tsx
<div
  className="prose prose-lg max-w-none dark:prose-invert tiptap"
  style={{ fontSize: `${fontSize}px` }}
  dangerouslySetInnerHTML={{ __html: processedContent }}
/>
```

### **2. Listing Page (`page.tsx`)**

**Excerpt (HTML):**
```tsx
{post.excerpt && (
  <div 
    className="text-sm text-gray-600 line-clamp-2 mb-2 tiptap"
    dangerouslySetInnerHTML={{ __html: post.excerpt }}
  />
)}
```

---

## ❌ WRONG Implementation

### **Don't Do This:**
```tsx
// ❌ WRONG - This treats HTML as plain text
<p>{post.excerpt}</p>

// ❌ WRONG - This is for Markdown, not HTML
<ReactMarkdown>{post.content}</ReactMarkdown>

// ❌ WRONG - No TipTap styling
<div dangerouslySetInnerHTML={{ __html: post.content }} />
```

### **Do This:**
```tsx
// ✅ CORRECT - Renders HTML with TipTap styles
<div 
  className="tiptap"
  dangerouslySetInnerHTML={{ __html: post.content }}
/>
```

---

## 🎨 Why the `.tiptap` Class?

The `.tiptap` class applies all the styling from `styles.css`:

```css
.tiptap a { color: var(--primary); } /* Blue links */
.tiptap h1 { font-size: 2em; } /* Large headings */
.tiptap .image-block { margin: auto; } /* Centered images */
.tiptap figcaption { text-align: center; } /* Centered captions */
```

**Without `.tiptap` class:**
- Links won't be blue
- Images won't be centered
- Captions won't be styled
- Headings won't be sized properly

---

## 📊 Data Flow

```
┌─────────────────┐
│  TipTap Editor  │
│  (Admin Panel)  │
└────────┬────────┘
         │
         │ Saves as HTML
         ▼
┌─────────────────┐
│    Database     │
│  content: HTML  │
│  excerpt: HTML  │
└────────┬────────┘
         │
         │ API Response
         ▼
┌─────────────────┐
│  Next.js Page   │
│  - Get HTML     │
│  - Add .tiptap  │
│  - Render HTML  │
└─────────────────┘
```

---

## 🔐 Security Note

**Is `dangerouslySetInnerHTML` Safe?**

✅ **YES** - In this case:
- Content comes from YOUR backend
- Created by authenticated admins only
- Stored in YOUR database
- TipTap sanitizes content

❌ **NO** - If:
- Content comes from untrusted users
- Not sanitized
- From external sources

---

## 📝 Quick Reference

### **What TipTap Gives You:**
| Feature | Format | How to Render |
|---------|--------|---------------|
| Content | HTML | `dangerouslySetInnerHTML` |
| Excerpt | HTML | `dangerouslySetInnerHTML` |
| Title | Plain text | `{post.title}` |
| Tags | Array | `.map()` |

### **Required Classes:**
```tsx
- .tiptap → TipTap editor styles
- .prose → Base typography
- .dark:prose-invert → Dark mode support
```

---

## 🎯 Both Pages Fixed!

### **Listing Page:**
✅ Excerpt renders as HTML (was plain text)
✅ Uses `.tiptap` class
✅ Supports `line-clamp-2`

### **Detail Page:**
✅ Excerpt renders as HTML
✅ Content renders as HTML
✅ Headings get IDs for outline
✅ All TipTap styles applied

---

## 🚀 Result

**Now the content renders properly:**
- ✅ HTML from TipTap (not Markdown)
- ✅ Images with captions centered
- ✅ Links are blue on hover
- ✅ Proper typography
- ✅ All styles from editor match display

**No more confusion! It's HTML all the way! 🎉**
