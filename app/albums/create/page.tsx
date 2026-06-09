"use client";

import { useEffect, useState } from "react";

interface Event {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function CreateAlbumPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [accessType, setAccessType] = useState("PUBLIC");
  const [eventId, setEventId] = useState("");
  const [userId, setUserId] = useState("");

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

    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        const allowedUsers = data.filter(
          (user: User) =>
            user.role === "ADMIN" || user.role === "PHOTOGRAPHER"
        );

        setUsers(allowedUsers);

        if (allowedUsers.length > 0) {
          setUserId(allowedUsers[0].id);
        }
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!userId) {
      setMessage("No Admin or Photographer user available");
      return;
    }

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
        userId,
      }),
    });

    if (response.ok) {
      setMessage("Album created successfully");
      setTitle("");
      setDescription("");
    } else {
      const data = await response.json();
      setMessage(data.error || "Failed to create album");
    }
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Create Album
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <select
          value={accessType}
          onChange={(e) => setAccessType(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="PUBLIC">PUBLIC</option>
          <option value="PRIVATE">PRIVATE</option>
        </select>

        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>

        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email}) - {user.role}
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

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}