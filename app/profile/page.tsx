"use client";

import { useEffect, useState } from "react";

interface Media {
  id: string;
  title: string | null;
  fileUrl: string;
  mediaType: string;
  album: {
    title: string;
    event: {
      name: string;
    };
  };
}

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  uploadedMedia: Media[];
  likes: unknown[];
  favourites: unknown[];
  comments: unknown[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, []);

  if (!profile) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
      <p className="text-gray-500">{profile.email}</p>
      <p className="text-gray-500 mb-6">Role: {profile.role}</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Stat title="Uploads" value={profile.uploadedMedia.length} />
        <Stat title="Likes" value={profile.likes.length} />
        <Stat title="Favourites" value={profile.favourites.length} />
        <Stat title="Comments" value={profile.comments.length} />
      </div>

      <h2 className="text-2xl font-bold mb-4">My Uploads</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {profile.uploadedMedia.map((item) => (
          <div key={item.id} className="border rounded-lg p-4">
            {item.mediaType === "IMAGE" ? (
              <img src={item.fileUrl} alt={item.title || ""} className="w-full rounded" />
            ) : (
              <video src={item.fileUrl} controls className="w-full rounded" />
            )}

            <h3 className="font-semibold mt-3">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.album.title}</p>
            <p className="text-sm text-gray-500">{item.album.event.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-gray-500">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}