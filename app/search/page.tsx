"use client";

import { useState } from "react";

interface Media {
  id: string;
  title: string | null;
  fileUrl: string;
  mediaType: string;
  tags: string[];
  createdAt: string;
  album: {
    title: string;
    event: {
      name: string;
    };
  };
  uploadedBy: {
    name: string;
    email: string;
  };
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Media[]>([]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch(`/api/media/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    setResults(data);
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Advanced Media Search</h1>

      <p className="text-gray-500 mb-6">
        Search by media title, tag, album, event name, uploader name, or uploader email.
      </p>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Try: uploaded, image, Freshers Night, Main Album, abc..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded flex-1"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 rounded">
          Search
        </button>
      </form>

      <p className="mb-4 text-sm text-gray-500">
        Results: {results.length}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map((item) => (
          <div key={item.id} className="border rounded-lg p-4">
            {item.mediaType === "IMAGE" ? (
              <img src={item.fileUrl} alt={item.title || ""} className="w-full rounded" />
            ) : (
              <video src={item.fileUrl} controls className="w-full rounded" />
            )}

            <h2 className="font-semibold mt-3">{item.title}</h2>

            <div className="flex flex-wrap gap-2 mt-2">
              {item.tags?.map((tag) => (
                <span key={tag} className="text-xs bg-gray-700 text-white px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-sm text-gray-500 mt-2">Album: {item.album.title}</p>
            <p className="text-sm text-gray-500">Event: {item.album.event.name}</p>
            <p className="text-sm text-gray-500">Uploaded by: {item.uploadedBy.name}</p>
            <p className="text-sm text-gray-500">
              Uploaded on: {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}