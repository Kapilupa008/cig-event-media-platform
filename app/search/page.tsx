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

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [media, setMedia] = useState<Media[]>([]);

  useEffect(() => {
    async function search() {
      const response = await fetch(
        `/api/media/search?q=${encodeURIComponent(query)}`
      );

      const data = await response.json();
      setMedia(data);
    }

    search();
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Search Media
      </h1>

      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-full mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {media.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4"
          >
            {item.mediaType === "IMAGE" ? (
              <img
                src={item.fileUrl}
                alt={item.title || ""}
                className="w-full rounded"
              />
            ) : (
              <video
                src={item.fileUrl}
                controls
                className="w-full rounded"
              />
            )}

            <h3 className="font-semibold mt-2">
              {item.title}
            </h3>

            <p className="text-sm text-gray-500">
              {item.album.title}
            </p>

            <p className="text-sm text-gray-500">
              {item.album.event.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}