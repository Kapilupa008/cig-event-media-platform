import Navbar from "../components/Navbar";
export default function Home() {
  return (
    <>
  <Navbar />
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-6">
          Event & Media Management Platform
        </h1>

        <p className="text-xl text-slate-300 mb-12">
          Upload • Organize • Discover
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-2">
              Event Management
            </h2>
            <p>Create and manage club events.</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-2">
              Media Albums
            </h2>
            <p>Organize photos and videos by event.</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-2">
              AI Search
            </h2>
            <p>Find media using smart tags.</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-2">
              Facial Recognition
            </h2>
            <p>Discover photos using a reference selfie.</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-2">
              Cloud Storage
            </h2>
            <p>Store media securely in the cloud.</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-2">
              Watermark Downloads
            </h2>
            <p>Protect media with dynamic watermarks.</p>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}