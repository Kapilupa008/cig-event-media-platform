"use client";

import { useEffect, useState } from "react";

interface Media {
  id: string;
  title: string | null;
  fileUrl: string;
  mediaType: string;
  tags: string[];

  album: {
    title: string;
    event: {
      name: string;
    };
  };
}

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([]);

  useEffect(() => {
    fetch("/api/media")
      .then((res) => res.json())
      .then((data) => setMedia(data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Media Gallery
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {media.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4"
          >
            {item.mediaType === "IMAGE" ? (
              <img
                src={item.fileUrl}
                alt={item.title || "Uploaded media"}
                className="w-full rounded"
              />
            ) : (
              <video
                src={item.fileUrl}
                controls
                className="w-full rounded"
              />
            )}

            <h2 className="font-semibold mt-3">
              {item.title}
            </h2>

            <div className="flex flex-wrap gap-2 mt-2">
              {item.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-700 text-white px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-sm text-gray-500 mt-2">
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