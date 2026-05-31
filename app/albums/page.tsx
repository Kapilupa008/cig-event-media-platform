"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Album {
  id: string;
  title: string;
  description: string | null;
  accessType: string;
  event: {
    name: string;
  };
  media: unknown[];
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    async function fetchAlbums() {
      const response = await fetch("/api/albums");
      const data = await response.json();
      setAlbums(data);
    }

    fetchAlbums();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Albums</h1>

      <div className="grid gap-4">
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/albums/${album.id}`}
            className="border rounded-lg p-4 shadow-sm block hover:bg-gray-900 transition"
          >
            <h2 className="text-xl font-semibold">{album.title}</h2>
            <p className="text-gray-600">{album.event.name}</p>
            <p>{album.description}</p>
            <p className="text-sm text-gray-500">
              {album.accessType} • {album.media.length} media items
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}