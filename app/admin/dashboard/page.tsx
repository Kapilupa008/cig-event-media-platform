"use client";

import { useEffect, useState } from "react";

interface Stats {
  users: number;
  events: number;
  albums: number;
  media: number;
  likes: number;
  favourites: number;
  comments: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Users" value={stats.users} />
        <StatCard title="Events" value={stats.events} />
        <StatCard title="Albums" value={stats.albums} />
        <StatCard title="Media Files" value={stats.media} />
        <StatCard title="Likes" value={stats.likes} />
        <StatCard title="Favourites" value={stats.favourites} />
        <StatCard title="Comments" value={stats.comments} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="border rounded-lg p-6 shadow-sm">
      <p className="text-gray-500">{title}</p>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
}