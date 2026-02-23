# Smart Bookmark App 🚀

## Project Overview
Smart Bookmark App is a full-stack web application that allows users to securely save, manage, update, and delete bookmarks.  
The application uses Google OAuth for authentication, ensures user-specific data privacy using Row Level Security (RLS), supports real-time updates, and is deployed on Vercel.

This project was built as part of a **Fullstack & AI/ML Micro-Challenge submission** to demonstrate practical full-stack development skills.

---

## 🌐 Live Demo
🔗 **Live URL:**  
https://smart-bookmark-app-one-kappa.vercel.app  

You can test the application by logging in with your own Google account.

---

## 🎯 Objective
The goal of this project was to demonstrate:

- Secure authentication using Google OAuth
- Protected routes and session handling
- User-specific database access control
- Real-time updates using Supabase
- Full CRUD functionality
- Successful cloud deployment

---

## ✨ Features

- 🔐 Google OAuth login
- 🔒 Protected dashboard route
- ➕ Add bookmarks
- 📖 View bookmarks
- ✏️ Edit (Update) bookmarks
- ❌ Delete bookmarks
- 🔄 Full CRUD operations
- ⚡ Real-time updates without page refresh
- 🛡 Row Level Security (RLS) enabled
- 🌐 Deployed on Vercel

---

## 🛠 Tech Stack

**Frontend**
- Next.js (App Router)
- React
- Tailwind CSS

**Backend**
- Supabase (Authentication + PostgreSQL Database)
- Supabase Realtime

**Deployment**
- Vercel

---

## 🧠 How the Application Works

1. User logs in using Google authentication.
2. After successful login, the user is redirected to the dashboard.
3. The dashboard route is protected — unauthenticated users are redirected.
4. Users can add bookmarks with title and URL.
5. Each bookmark is stored with the authenticated user's `user_id`.
6. Supabase Row Level Security ensures users can only access their own bookmarks.
7. Real-time subscriptions update the UI instantly when data changes.
8. Users can edit or delete their own bookmarks.

---

## 🗄 Database Design

The application uses a `bookmarks` table with the following structure:

| Column       | Type      | Description |
|--------------|-----------|-------------|
| id           | UUID      | Primary Key |
| user_id      | UUID      | Supabase Auth User ID |
| title        | Text      | Bookmark title |
| url          | Text      | Bookmark URL |
| created_at   | Timestamp | Record creation time |

---

## 🔐 Security Implementation

- Supabase **Row Level Security (RLS)** is enabled.
- Policies ensure:
  - Users can read only their own bookmarks
  - Users can insert bookmarks only with their own `user_id`
  - Users can update only their own bookmarks
  - Users can delete only their own bookmarks

This guarantees strict user-level data isolation.

---

## 🚧 Challenges Faced & How I Solved Them

### 1. Google OAuth Redirect Issues (Production vs Local)
**Problem:**  
Google authentication worked locally but failed after deployment due to redirect configuration mismatch.

**Solution:**  
Updated Supabase Authentication settings by adding the Vercel production URL in:
- Site URL
- Redirect URLs

**Learning:**  
Authentication configurations must be handled separately for development and production environments.

---

### 2. Environment Variables in Production
**Problem:**  
Initial deployment failed because required environment variables were not configured in Vercel.

**Solution:**  
Added the following environment variables in Vercel Project Settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Learning:**  
Cloud deployments require explicit environment configuration. Local `.env.local` files are not automatically applied in production.

---

### 3. Ensuring User Data Privacy
**Problem:**  
Preventing users from accessing other users’ bookmarks.

**Solution:**  
Enabled Supabase Row Level Security and created policies using `auth.uid()` to restrict SELECT, INSERT, UPDATE, and DELETE operations.

**Learning:**  
Backend-level access control is critical for secure applications.

---

### 4. Implementing Real-Time Updates
**Problem:**  
Ensuring bookmarks update instantly without page refresh.

**Solution:**  
Implemented Supabase Realtime subscriptions to listen for database changes and re-fetch updated data.

**Learning:**  
Realtime functionality improves user experience but requires proper subscription cleanup to avoid memory leaks.

---

### 5. Synchronizing Local and Production Behavior
**Problem:**  
Differences between local development and production deployment behavior.

**Solution:**  
Verified GitHub branch configuration, environment variables, Supabase project consistency, and Vercel deployment settings.

**Learning:**  
Debugging deployment issues strengthened my understanding of CI/CD workflows and production debugging.

---

## ⚙️ Running the Project Locally

1. Clone the repository:
