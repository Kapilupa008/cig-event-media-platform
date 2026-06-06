"use client";

import { useEffect, useState } from "react";

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="border rounded-lg p-4"
          >
            <p>{notification.message}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}