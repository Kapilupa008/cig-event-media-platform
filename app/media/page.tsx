"use client";

import { useEffect, useState } from "react";

interface Comment {
  id: string;
  content: string;
  user: {
    name: string;
  };
}

interface Media {
  id: string;
  title: string | null;
  fileUrl: string;
  mediaType: string;
  tags: string[];
  likes: unknown[];
  favourites: unknown[];
  comments: Comment[];

  album: {
    title: string;
    event: {
      name: string;
    };
  };
}

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [comments, setComments] = useState<Record<string, string>>({});

  const USER_ID = "cmps1sw3k0002xwldgxb16r8h";

  async function loadMedia() {
    const response = await fetch("/api/media");
    const data = await response.json();
    setMedia(data);
  }

  useEffect(() => {
    loadMedia();
  }, []);

  async function likeMedia(mediaId: string) {
    await fetch(`/api/media/${mediaId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: USER_ID,
      }),
    });

    loadMedia();
  }

  async function favouriteMedia(mediaId: string) {
    await fetch(`/api/media/${mediaId}/favourite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: USER_ID,
      }),
    });

    loadMedia();
  }

  async function commentMedia(mediaId: string) {
    const content = comments[mediaId];

    if (!content) return;

    await fetch(`/api/media/${mediaId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: USER_ID,
        content,
      }),
    });

    setComments((prev) => ({
      ...prev,
      [mediaId]: "",
    }));

    loadMedia();
  }

  function shareMedia(fileUrl: string) {
    const url = `${window.location.origin}${fileUrl}`;

    navigator.clipboard.writeText(url);

    alert("Media link copied");
  }

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

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => likeMedia(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                ❤️ {item.likes.length}
              </button>

              <button
                onClick={() => favouriteMedia(item.id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                ⭐ {item.favourites.length}
              </button>
            </div>

            <div className="flex gap-2 mt-2">
                    <a
          href={`/api/media/${item.id}/download`}
          download
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          ⬇ Download
        </a>

              <button
                onClick={() => shareMedia(item.fileUrl)}
                className="bg-purple-600 text-white px-3 py-1 rounded"
              >
                🔗 Share
              </button>
            </div>

            <div className="mt-4">
              <p className="font-semibold mb-2">
                Comments
              </p>

              <div className="space-y-2 mb-3">
                {item.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="text-sm border rounded p-2"
                  >
                    <span className="font-semibold">
                      {comment.user.name}:
                    </span>{" "}
                    {comment.content}
                  </div>
                ))}
              </div>

              <input
                type="text"
                placeholder="Add comment..."
                value={comments[item.id] || ""}
                onChange={(e) =>
                  setComments((prev) => ({
                    ...prev,
                    [item.id]: e.target.value,
                  }))
                }
                className="border p-2 rounded w-full"
              />

              <button
                onClick={() => commentMedia(item.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
              >
                Add Comment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}