"use client";

import { useEffect, useState } from "react";

interface Favourite {
  id: string;
  media: {
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
  };
}

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState<Favourite[]>([]);

  useEffect(() => {
    fetch("/api/favourites")
      .then((res) => res.json())
      .then((data) => setFavourites(data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        My Favourite Media
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {favourites.map((fav) => (
          <div
            key={fav.id}
            className="border rounded-lg p-4"
          >
            {fav.media.mediaType === "IMAGE" ? (
              <img
                src={fav.media.fileUrl}
                alt={fav.media.title || ""}
                className="w-full rounded"
              />
            ) : (
              <video
                src={fav.media.fileUrl}
                controls
                className="w-full rounded"
              />
            )}

            <h2 className="font-semibold mt-3">
              {fav.media.title}
            </h2>

            <p className="text-sm text-gray-500">
              {fav.media.album.title}
            </p>

            <p className="text-sm text-gray-500">
              {fav.media.album.event.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}