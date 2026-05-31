"use client";

import { useEffect, useState } from "react";

interface Album {
  id: string;
  title: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function UploadMediaPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [uploadedById, setUploadedById] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/albums")
      .then((res) => res.json())
      .then((data) => {
        setAlbums(data);
        if (data.length > 0) setAlbumId(data[0].id);
      });

    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        if (data.length > 0) setUploadedById(data[0].id);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("albumId", albumId);
    formData.append("uploadedById", uploadedById);

    const response = await fetch("/api/media", {
      method: "POST",
      body: formData,
    });

if (response.ok) {
  setMessage("Media uploaded successfully");
  setFile(null);
  setTitle("");
} else {
  const errorText = await response.text();
  setMessage(errorText || "Failed to upload media");
}
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Upload Media</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Media title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-2 rounded w-full"
        />

        <select
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          {albums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.title}
            </option>
          ))}
        </select>

        <select
          value={uploadedById}
          onChange={(e) => setUploadedById(e.target.value)}
          className="border p-2 rounded w-full"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>

        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
          Upload
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}