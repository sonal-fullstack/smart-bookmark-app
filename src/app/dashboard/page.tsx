"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // 🔐 Protect route & get user
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace("/");
      } else {
        setUserEmail(data.session.user.email ?? null);
        setUserId(data.session.user.id);
      }
    };

    checkUser();
  }, [router]);

  // 📥 Fetch bookmarks
  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  // 🔄 Realtime updates
  useEffect(() => {
    if (!userId) return;

    fetchBookmarks();

    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // ➕ Add bookmark (instant UI update)
  const addBookmark = async () => {
    if (!title || !url || !userId) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .insert({
        title,
        url,
        user_id: userId,
      })
      .select()
      .single();

    if (!error && data) {
      setBookmarks((prev) => [data, ...prev]); // instant UI update
      setTitle("");
      setUrl("");
    }
  };

  // ❌ Delete bookmark (instant UI update)
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  // 🚪 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col p-6 shadow-2xl">
        <h1 className="text-2xl font-bold mb-10 tracking-wide">
          SmartBookmark
        </h1>

        <nav className="flex flex-col gap-4 text-sm">
          <a className="bg-slate-800 p-3 rounded-xl">Dashboard</a>
          <a className="hover:bg-slate-800 p-3 rounded-xl transition">
            Bookmarks
          </a>
          <a className="hover:bg-slate-800 p-3 rounded-xl transition">
            Analytics
          </a>
          <a className="hover:bg-slate-800 p-3 rounded-xl transition">
            Settings
          </a>
        </nav>

        <div className="mt-auto text-xs opacity-60">
          © 2026 SmartBookmark
        </div>
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-white/70 backdrop-blur-md shadow px-8 py-4 flex justify-between items-center border-b">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Dashboard Overview
            </h2>
            {userEmail && (
              <p className="text-sm text-slate-500">
                Logged in as {userEmail}
              </p>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8 text-slate-800">
            Welcome Back 👋
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border">
              <h2 className="text-sm text-slate-500">Total Bookmarks</h2>
              <p className="text-3xl mt-3 font-bold text-indigo-600">
                {bookmarks.length}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border">
              <h2 className="text-sm text-slate-500">Categories</h2>
              <p className="text-3xl mt-3 font-bold text-green-600">—</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border">
              <h2 className="text-sm text-slate-500">Saved This Week</h2>
              <p className="text-3xl mt-3 font-bold text-purple-600">—</p>
            </div>
          </div>

          {/* Bookmarks */}
          <div className="mt-12 bg-white p-6 rounded-2xl shadow-lg border">
            <h2 className="text-xl font-semibold mb-4">
              Your Bookmarks
            </h2>

            <div className="flex gap-3 mb-6">
              <input
                className="flex-1 border p-2 rounded-lg"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                className="flex-1 border p-2 rounded-lg"
                placeholder="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                onClick={addBookmark}
                className="bg-indigo-600 text-white px-4 rounded-lg"
              >
                Add
              </button>
            </div>

            <ul className="space-y-3">
              {bookmarks.map((b) => (
                <li
                  key={b.id}
                  className="flex justify-between items-center border p-3 rounded-lg"
                >
                  <a
                    href={b.url}
                    target="_blank"
                    className="text-indigo-600 underline"
                  >
                    {b.title}
                  </a>
                  <button
                    onClick={() => deleteBookmark(b.id)}
                    className="px-3 py-1 text-sm font-medium text-red-600
                               border border-red-300 rounded-lg
                               hover:bg-red-50 hover:border-red-500
                               transition"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}