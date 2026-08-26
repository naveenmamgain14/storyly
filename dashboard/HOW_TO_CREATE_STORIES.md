# 📱 How to Create Stories - Complete Guide

## ✅ **New Story Creation Form Added!**

Your Stories page now has:
- ✅ **Title Input** - Name your story
- ✅ **Media Type Selection** - Choose Image or Video
- ✅ **File Upload** - Upload multiple files
- ✅ **Preview** - See uploaded media before saving
- ✅ **Save as Draft** - Save without publishing
- ✅ **Publish** - Make story live
- ✅ **Story List** - View all created stories
- ✅ **Edit Status** - Publish/Unpublish stories
- ✅ **Delete** - Remove stories

---

## 🚀 How to Create a Story

### **Step 1: Go to Stories Page**

1. Open dashboard: http://localhost:5173
2. Login with your account
3. Click **"Stories"** in the sidebar

### **Step 2: Click "Create Story"**

You'll see a form with:
```
┌─────────────────────────────────────┐
│ Create New Story                    │
├─────────────────────────────────────┤
│ Story Title                         │
│ [________________]                  │
│                                     │
│ Media Type                          │
│ [ 📷 Image ] [ 🎥 Video ]          │
│                                     │
│ Upload Files                        │
│ [ Drag & Drop or Click ]           │
│                                     │
│ [ Save as Draft ] [ Publish ]      │
└─────────────────────────────────────┘
```

### **Step 3: Enter Story Title**

Examples:
- "Summer Sale 2026"
- "New Product Launch"
- "Flash Deals"
- "Behind the Scenes"

```
Title: [Summer Sale 2026________]
```

### **Step 4: Select Media Type**

**Two options:**

**📷 Image** - For photos
- JPG, PNG, GIF, WebP
- Max 10MB per file
- Multiple images allowed

**🎥 Video** - For videos
- MP4, WebM, MOV
- Max 50MB per file
- Multiple videos allowed

Click the button to select:
```
[ 📷 Image ]  ← Selected (blue)
[ 🎥 Video ]  ← Not selected (gray)
```

### **Step 5: Upload Media Files**

**Method 1: Click to Upload**
1. Click the upload area
2. File browser opens
3. Select one or multiple files
4. Click "Open"

**Method 2: Drag & Drop**
1. Open file explorer
2. Select files
3. Drag them to the upload area
4. Drop to upload

**Upload Area:**
```
┌────────────────────────────────┐
│           📷                   │
│                                │
│  Click to upload or drag drop  │
│  JPG, PNG, GIF, WebP           │
│  (max 10MB)                    │
└────────────────────────────────┘
```

### **Step 6: Preview Uploaded Media**

After upload, you'll see:
```
Uploaded Media (3)
┌─────┐ ┌─────┐ ┌─────┐
│  ×  │ │  ×  │ │  ×  │
│ img │ │ img │ │ img │
│ 📷5s│ │ 📷5s│ │ 📷5s│
└─────┘ └─────┘ └─────┘
```

- **×** button = Remove this media
- **5s** = Duration (5 seconds default)
- **📷** = Image type
- **🎥** = Video type

**To remove a file:**
- Click the **×** button on any media

### **Step 7: Save or Publish**

**Two options:**

**Save as Draft**
- Story is saved but NOT visible in app
- You can edit later
- Status: "draft" (yellow badge)

**Publish Story**
- Story goes live immediately
- Visible in Android app
- Status: "published" (green badge)

```
[ Save as Draft ] [ Publish Story ]
```

---

## 📋 **Story List View**

After creating stories, you'll see a table:

```
┌────────────────────────────────────────────────────────┐
│ Title        │ Media │ Status    │ Created  │ Actions │
├────────────────────────────────────────────────────────┤
│ Summer Sale  │ 📷📷📷 │ Published │ 8/25/26  │ Actions │
│              │  (3)  │           │          │         │
├────────────────────────────────────────────────────────┤
│ New Products │ 📷📷   │ Draft     │ 8/24/26  │ Actions │
│              │  (2)  │           │          │         │
└────────────────────────────────────────────────────────┘
```

### **Columns:**

**Title**
- Name of your story

**Media**
- Thumbnail previews
- Count in parentheses

**Status**
- 🟢 Published (green badge)
- 🟡 Draft (yellow badge)

**Created**
- Date story was created

**Actions**
- **Publish** - Make draft live
- **Unpublish** - Turn published to draft
- **Delete** - Remove story

---

## 🎬 **Example Workflows**

### **Example 1: Image Story**

```
1. Click "Create Story"
2. Title: "Summer Collection"
3. Select: 📷 Image
4. Upload: 5 product photos
5. Preview: See all 5 images
6. Click: "Publish Story"
✅ Story created and live!
```

### **Example 2: Video Story**

```
1. Click "Create Story"
2. Title: "Product Demo"
3. Select: 🎥 Video
4. Upload: 3 short videos
5. Preview: See all 3 videos
6. Click: "Save as Draft"
✅ Story saved as draft!
```

### **Example 3: Mixed Media**

**Story 1 - Images:**
```
Title: "Photos"
Type: 📷 Image
Files: photo1.jpg, photo2.jpg
```

**Story 2 - Videos:**
```
Title: "Videos"
Type: 🎥 Video
Files: video1.mp4, video2.mp4
```

---

## 🎨 **Features Explained**

### **1. Title Input**
```
Story Title
[Summer Sale 2026_____________]
```
- Required field
- Shows in Android app
- Brief and descriptive

### **2. Media Type Selector**
```
Media Type
[ 📷 Image ]  [ 🎥 Video ]
    ↑              ↑
  Active       Inactive
```
- **Blue** = Selected
- **Gray** = Not selected
- Click to switch

### **3. Upload Area**
```
┌─────────────────────────────┐
│          📷/🎥              │
│                             │
│ Click to upload or drag     │
│ JPG, PNG, GIF, WebP         │
│ (max 10MB)                  │
└─────────────────────────────┘
```
- **Click** = Opens file browser
- **Drag** = Drop files directly
- **Multiple** = Upload many at once

### **4. Media Preview Grid**
```
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│  ×   │ │  ×   │ │  ×   │ │  ×   │
│      │ │      │ │      │ │      │
│ 📷5s │ │ 📷5s │ │ 🎥5s │ │ 📷5s │
└──────┘ └──────┘ └──────┘ └──────┘
```
- Shows thumbnails
- Duration overlay (5s default)
- Remove button (×)

### **5. Save Buttons**
```
[ Save as Draft ]  [ Publish Story ]
      Draft              Live
```
- **Draft** = Save for later
- **Publish** = Goes live now

---

## 💾 **Where Stories Are Saved**

Stories are saved in **localStorage**:

```javascript
{
  "id": "1724598234567",
  "title": "Summer Sale",
  "media": [
    {
      "id": "1724598234567.123",
      "type": "image",
      "url": "data:image/jpeg;base64,...",
      "duration": 5
    }
  ],
  "createdAt": "2026-08-25T10:30:00.000Z",
  "status": "published"
}
```

**Persists across sessions!**
- Stories stay saved even after closing browser
- Can be viewed again anytime

---

## 📱 **Story Actions**

### **Publish a Draft:**
```
Status: Draft
Action: Click "Publish"
Result: Status → Published ✅
```

### **Unpublish a Story:**
```
Status: Published
Action: Click "Unpublish"
Result: Status → Draft ✅
```

### **Delete a Story:**
```
Action: Click "Delete"
Confirm: "Are you sure?"
Result: Story removed ✅
```

---

## ✅ **Validation**

### **Required Fields:**
- ✅ Title must not be empty
- ✅ At least 1 media file required

### **File Validation:**
**Images:**
- JPG, PNG, GIF, WebP only
- Max 10MB per file

**Videos:**
- MP4, WebM, MOV only
- Max 50MB per file

### **Error Messages:**
```
❌ "Please enter a title"
❌ "Please upload at least one media file"
```

---

## 🎯 **Tips**

### **Best Practices:**
- Keep titles short (2-4 words)
- Use 3-5 media items per story
- Mix images and videos in different stories
- Start with drafts, then publish

### **Media Tips:**
- Use high-quality images (at least 1080px)
- Keep videos short (under 30 seconds)
- Landscape orientation works best
- Test on mobile before publishing

### **Organization:**
- Create drafts first
- Review all media
- Check on mobile
- Then publish

---

## 🚀 **Try It Now!**

### **Quick Test:**

**Step 1:** Go to http://localhost:5173/stories

**Step 2:** Click "Create Story"

**Step 3:** Fill in:
```
Title: Test Story
Type: 📷 Image
Upload: Select any image from your computer
```

**Step 4:** Click "Publish Story"

**Step 5:** See your story in the list! ✅

---

## 📊 **What You'll See:**

### **Empty State:**
```
┌─────────────────────────────┐
│          📱                 │
│                             │
│ No stories yet.             │
│ Create your first story!    │
│                             │
│   [ Create Story ]          │
└─────────────────────────────┘
```

### **With Stories:**
```
┌────────────────────────────────────┐
│ Stories           [ Create Story ] │
├────────────────────────────────────┤
│                                    │
│ Title │ Media │ Status │ Actions  │
│────────────────────────────────────│
│ Sale  │ 📷📷📷 │ 🟢 Pub │ Edit Del│
│ New   │ 📷📷   │ 🟡 Dra │ Pub  Del│
└────────────────────────────────────┘
```

---

## 🎉 **Complete!**

Your Stories page now has:
- ✅ Full story creation form
- ✅ Title input
- ✅ Image/Video type selection
- ✅ Multi-file upload
- ✅ Media preview
- ✅ Draft and publish options
- ✅ Story management (edit status, delete)
- ✅ Saves to localStorage

**Everything works without backend!** 🚀

Ready to create your first story? Go to the Stories page and try it! 📱✨
