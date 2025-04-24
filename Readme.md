# 📹 Video Progress Tracker

A video-based learning platform that **accurately tracks how much of a lecture video a user has truly watched**, preventing progress inflation from seeking or rewatching. It includes user authentication and persistent video tracking — so students can resume exactly where they left off.

---

## 🎯 Objective

In many learning platforms, progress is marked “complete” just because a video played to the end — even if a student skipped around. This project solves that by **only tracking real, unique viewing**.

---

## 💡 Key Features

- ✅ **Real Progress Tracking**: Only adds progress when new, previously unseen parts of a video are played.
- 🔁 **No Duplicate Counting**: Rewatching doesn’t increase progress.
- ⏩ **Seek Detection**: Skipping ahead doesn’t count toward progress.
- 🔄 **Persistent Resume**: When users return, the video resumes from the last truly watched position.
- 👤 **User Authentication**: Login and signup to keep user-specific video progress tracked and secure.

---

## 🧠 My Approach

Instead of relying on traditional progress tracking, I use a **Set-based approach** that:

1. Tracks each unique second watched (using `Set()` for efficiency).
2. Converts those watched seconds into a merged interval list.
3. Sends that merged data to the server for storage.
4. Resumes the video at the last truly watched timestamp.

**Why this works well:**
- `Set` ensures no duplicate seconds are counted.
- The backend stores merged intervals, reducing payload size.
- Progress is saved on `pause`, `unload`, and page navigation.
- Works even if the user jumps across different timestamps.

---

## 🛠️ Tech Stack

| Layer        | Tech Used                     | 
|--------------|-------------------------------|
| Frontend     | React, Vite, React Router     |
| Styling      | Plain CSS                     | 
| Backend      | Node.js, Express              | 
| Database     | MongoDB                       | 
| Auth         | JWT + bcrypt                  |
| API Client   | Axios                         |

---


