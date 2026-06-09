import Link from "next/link";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          CIG Media Platform
        </Link>

        <div className="flex gap-6 text-slate-300 items-center">
          <Link href="/events" className="hover:text-white">
            Events
          </Link>

          <Link href="/events/create" className="hover:text-white">
            Create Event
          </Link>

          <Link href="/albums" className="hover:text-white">
            Albums
          </Link>

          <Link href="/albums/create" className="hover:text-white">
            Create Album
          </Link>

          <Link href="/media" className="hover:text-white">
            Media
          </Link>

          <Link href="/media/upload" className="hover:text-white">
            Upload
          </Link>

          <Link href="/search" className="hover:text-white">
            Search
          </Link>

          <Link href="/favourites" className="hover:text-white">
            Favourites
          </Link>

          <Link href="/profile" className="hover:text-white">
            Profile
          </Link>

          <Link href="/admin/dashboard" className="hover:text-white">
            Dashboard
          </Link>

          <NotificationBell />
        </div>
      </div>
    </nav>
  );
}