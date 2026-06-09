"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import NotificationBell from "./NotificationBell";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  function loadUser() {
    const stored = localStorage.getItem("currentUser");

    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      setUser(null);
    }
  }

  useEffect(() => {
    loadUser();

    window.addEventListener("userChanged", loadUser);

    return () => {
      window.removeEventListener("userChanged", loadUser);
    };
  }, []);

  function logout() {
    localStorage.removeItem("currentUser");
    setUser(null);
    window.location.href = "/login";
  }

  const isAdmin = user?.role === "ADMIN";
  const canCreateMedia =
  user?.role === "ADMIN" ||
  user?.role === "PHOTOGRAPHER" ||
  user?.role === "VIEWER";

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          CIG Media Platform
        </Link>

        <div className="flex gap-6 text-slate-300 items-center">
          <Link href="/events" className="hover:text-white">
            Events
          </Link>

          {isAdmin && (
            <Link href="/events/create" className="hover:text-white">
              Create Event
            </Link>
          )}

          <Link href="/albums" className="hover:text-white">
            Albums
          </Link>

          {canCreateMedia && (
            <Link href="/albums/create" className="hover:text-white">
              Create Album
            </Link>
          )}

          <Link href="/media" className="hover:text-white">
            Media
          </Link>

          {canCreateMedia && (
            <Link href="/media/upload" className="hover:text-white">
              Upload
            </Link>
          )}

          <Link href="/search" className="hover:text-white">
            Search
          </Link>

          <Link href="/favourites" className="hover:text-white">
            Favourites
          </Link>

          {user && (
            <Link href="/profile" className="hover:text-white">
              Profile
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin/dashboard" className="hover:text-white">
              Dashboard
            </Link>
          )}

          {user ? (
            <>
              <span className="text-white text-sm">
                {user.name} ({user.role})
              </span>

              <button onClick={logout} className="hover:text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-white">
                Login
              </Link>

              <Link href="/register" className="hover:text-white">
                Register
              </Link>
            </>
          )}

          {user && <NotificationBell />}
        </div>
      </div>
    </nav>
  );
}