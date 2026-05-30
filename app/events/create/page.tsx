"use client";

import { useState } from "react";

export default function CreateEventPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        category,
        eventDate,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Event created successfully!");
      setName("");
      setDescription("");
      setCategory("");
      setEventDate("");
    } else {
      setMessage(data.error || "Failed to create event");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input className="border p-2 rounded" placeholder="Event name" value={name} onChange={(e) => setName(e.target.value)} />

        <textarea className="border p-2 rounded" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <input className="border p-2 rounded" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />

        <input className="border p-2 rounded" type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />

        <button className="bg-blue-600 text-white p-2 rounded" type="submit">
          Create Event
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}