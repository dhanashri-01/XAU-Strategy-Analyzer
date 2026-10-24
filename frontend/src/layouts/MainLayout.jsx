import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="app-page min-h-screen text-slate-100 md:flex">

      <Sidebar />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">

        <a href="#main-content" className="sr-only z-50 rounded-md bg-emerald-300 px-4 py-2 font-semibold text-slate-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to main content</a>

        <Navbar />

        <main id="main-content" className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-10 lg:py-9 md:pb-8">

          {children}

        </main>

      </div>

    </div>
  );
}

export default MainLayout;
