# Smart Bookmark App 🚀

## Project Overview
Smart Bookmark App is a full-stack web application that allows users to securely save, manage, and delete bookmarks.  
The application uses Google OAuth for authentication, ensures user-specific data privacy, supports real-time updates, and is deployed on Vercel.

This project was built as part of a **job-ready technical assessment** to demonstrate practical full-stack development skills.

---

## Live Demo
🔗 **Live URL:**  
https://smart-bookmark-app-one-kappa.vercel.app

> You can test the application by logging in with your own Google account.

---

## Why This Project
The goal of this project was to demonstrate:
- Authentication using Google OAuth
- Secure handling of user data
- Real-time database updates
- End-to-end deployment of a production-ready web application

---

## Features
- 🔐 Google OAuth login (no email/password)
- ➕ Add bookmarks using title and URL
- 🔒 Private bookmarks for each user
- ⚡ Real-time updates without page refresh
- ❌ Delete bookmarks
- 🌐 Deployed on Vercel

---

## Tech Stack
- **Frontend:** Next.js (App Router)
- **Authentication:** Supabase Auth (Google OAuth)
- **Database:** Supabase PostgreSQL
- **Realtime:** Supabase Realtime
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

---

## How the Application Works
1. User logs in using Google authentication.
2. After successful login, the user is redirected to the dashboard.
3. User can add bookmarks by entering a title and URL.
4. Bookmarks are stored in the database with the user’s unique ID.
5. Row Level Security ensures users can access only their own bookmarks.
6. Realtime listeners update the UI instantly across tabs.
7. User can delete their own bookmarks.

---

## Database Design
The application uses a `bookmarks` table with the following fields:

| Column       | Type      | Description |
|--------------|-----------|-------------|
| id           | UUID      | Primary key |
| user_id      | UUID      | Supabase Auth user ID |
| title        | Text      | Bookmark title |
| url          | Text      | Bookmark URL |
| created_at   | Timestamp | Record creation time |

---

## Security Implementation
- Supabase **Row Level Security (RLS)** is enabled.
- Policies ensure:
  - Users can read only their own bookmarks
  - Users can insert bookmarks with their own `user_id`
  - Users can delete only their own bookmarks

---

## Challenges Faced & Solutions

### 1. Google OAuth Redirect Issue
**Problem:**  
Google login worked locally but failed after deployment.

**Solution:**  
Updated Supabase Authentication settings by adding the Vercel live URL as:
- Site URL
- Redirect URL

---

### 2. Vercel Deployment Errors
**Problem:**  
Initial deployment failed due to missing environment variables.

**Solution:**  
Configured required environment variables in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### 3. Data Privacy Between Users
**Problem:**  
Ensuring users cannot see other users’ bookmarks.

**Solution:**  
Implemented Supabase Row Level Security (RLS) policies using `auth.uid()`.

---

## Running the Project Locally
1. Clone the repository
2. Install dependencies using `npm install`
3. Create a `.env.local` file with:
