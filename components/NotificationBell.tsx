"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      setCount(0);
      return;
    }

    const user = JSON.parse(currentUser);

    fetch(`/api/notifications?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCount(data.length);
        } else {
          setCount(0);
        }
      });
  }, []);

  return (
    <Link href="/notifications" className="relative text-2xl">
      🔔

      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
}