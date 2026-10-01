import { Bell, Search, UserCircle } from "lucide-react";

function Navbar() {
  return (
    <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">

      {/* Left */}

      <div>

        <h1 className="text-2xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-slate-400 text-sm">
          Welcome back, Aniruddh 👋
        </p>

      </div>

      {/* Center */}

      <div className="w-[420px]">

        <div className="flex items-center bg-slate-800 rounded-xl px-4 py-3">

          <Search
            className="text-slate-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search Strategy..."
            className="bg-transparent outline-none ml-3 w-full text-white placeholder:text-slate-500"
          />

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        <button className="relative">

          <Bell
            size={23}
            className="text-slate-300 hover:text-white"
          />

          <span className="absolute -top-2 -right-2 w-2 h-2 rounded-full bg-green-500"></span>

        </button>

        <div className="flex items-center gap-2">

          <UserCircle
            size={38}
            className="text-green-500"
          />

          <div>

            <h2 className="text-white font-medium">
              Aniruddh
            </h2>

            <p className="text-xs text-slate-400">
              Web Developer
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;