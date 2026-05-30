export default function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">
          CIG Media Platform
        </h1>

        <div className="flex gap-6 text-slate-300">
          <button className="hover:text-white">
            Events
          </button>

          <button className="hover:text-white">
            Albums
          </button>

          <button className="hover:text-white">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}