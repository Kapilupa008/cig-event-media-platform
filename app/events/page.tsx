"use client";

import { useEffect, useState } from "react";

interface Event {
  id: string;
  name: string;
  description: string | null;
  category: string;
  eventDate: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();

        setEvents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        Loading events...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Events
      </h1>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-4 shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                {event.name}
              </h2>

              <p className="text-gray-600">
                {event.category}
              </p>

              {event.description && (
                <p className="mt-2">
                  {event.description}
                </p>
              )}

              <p className="mt-2 text-sm text-gray-500">
                {new Date(event.eventDate).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}