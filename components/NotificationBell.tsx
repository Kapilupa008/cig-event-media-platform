"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setCount(data.length));
  }, []);

  return (
    <Link
      href="/notifications"
      className="relative text-2xl"
    >
      🔔

      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
}