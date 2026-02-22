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

  // ✅ NEW STATES FOR EDIT
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

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

  // ➕ Add bookmark
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
      setBookmarks((prev) => [data, ...prev]);
      setTitle("");
      setUrl("");
    }
  };

  // ❌ Delete bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  // ✅ UPDATE BOOKMARK
  const updateBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .update({
        title: editTitle,
        url: editUrl,
      })
      .eq("id", id);

    if (!error) {
      setBookmarks((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, title: editTitle, url: editUrl } : b
        )
      );
      setEditingId(null);
    }
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

        {/* Content */}
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8 text-slate-800">
            Welcome Back 👋
          </h1>

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
                  className="border p-3 rounded-lg"
                >
                  {editingId === b.id ? (
                    <div className="flex gap-2">
                      <input
                        className="flex-1 border p-2 rounded"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <input
                        className="flex-1 border p-2 rounded"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                      />
                      <button
                        onClick={() => updateBookmark(b.id)}
                        className="bg-green-600 text-white px-3 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-3 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <a
                        href={b.url}
                        target="_blank"
                        className="text-indigo-600 underline"
                      >
                        {b.title}
                      </a>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setEditingId(b.id);
                            setEditTitle(b.title);
                            setEditUrl(b.url);
                          }}
                          className="px-3 py-1 text-sm border rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteBookmark(b.id)}
                          className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}