"use client";

import { use, useEffect, useState } from "react";

interface Media {
  id: string;
  title: string | null;
  fileUrl: string;
  mediaType: string;
}

interface Album {
  id: string;
  title: string;
  description: string | null;
  media: Media[];
}

export default function AlbumDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    fetch(`/api/albums/${id}`)
      .then((res) => res.json())
      .then((data) => setAlbum(data));
  }, [id]);

  if (!album) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold">{album.title}</h1>

      <p className="text-gray-500 mt-2">{album.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {album.media.map((item) => (
          <div key={item.id} className="border rounded-lg p-4">
            {item.mediaType === "IMAGE" ? (
              <img
                src={item.fileUrl}
                alt={item.title || ""}
                className="w-full rounded"
              />
            ) : (
              <video src={item.fileUrl} controls className="w-full rounded" />
            )}

            <p className="mt-2">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}