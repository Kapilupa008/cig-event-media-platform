"use client";

import { useEffect, useState } from "react";

interface Event {
  id: string;
  name: string;
}

export default function CreateAlbumPage() {
  const [events, setEvents] = useState<Event[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [accessType, setAccessType] = useState("PUBLIC");
  const [eventId, setEventId] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);

        if (data.length > 0) {
          setEventId(data[0].id);
        }
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("/api/albums", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        accessType,
        eventId,
        userId: "cmps1sw3k0002xwldgxb16r8h",
      }),
    });

    if (response.ok) {
      setMessage("Album created successfully");

      setTitle("");
      setDescription("");
    } else {
      setMessage("Failed to create album");
    }
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Create Album
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Album Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="border p-2 rounded w-full"
        />

        <select
          value={accessType}
          onChange={(e) =>
            setAccessType(e.target.value)
          }
          className="border p-2 rounded w-full"
        >
          <option value="PUBLIC">
            PUBLIC
          </option>

          <option value="PRIVATE">
            PRIVATE
          </option>
        </select>

        <select
          value={eventId}
          onChange={(e) =>
            setEventId(e.target.value)
          }
          className="border p-2 rounded w-full"
        >
          {events.map((event) => (
            <option
              key={event.id}
              value={event.id}
            >
              {event.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          Create Album
        </button>
      </form>

      {message && (
        <p className="mt-4">
          {message}
        </p>
      )}
    </div>
  );
}