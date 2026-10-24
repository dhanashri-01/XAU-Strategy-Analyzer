import {
  LayoutDashboard,
  BrainCircuit,
  History,
  BarChart3,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Strategy",
    icon: BrainCircuit,
    path: "/strategy",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    title: "History",
    icon: History,
    path: "/history",
  },
  
];

function Sidebar() {
  return (
    <>
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-800/80 bg-slate-950 md:flex">

      {/* Logo */}

      <div className="p-6 border-b border-slate-800">

        <h1 className="text-xl font-bold tracking-tight text-white">XAU <span className="text-emerald-400">Strategy</span></h1>

        <p className="text-sm text-slate-400">
          Trading Analyzer
        </p>

      </div>

      {/* Menu */}

      <nav aria-label="Main navigation" className="flex-1 px-4 py-6">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink

              key={item.title}

              to={item.path}

              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400

                ${
                  isActive
                    ? "bg-green-600 text-slate-950 font-semibold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }

            >

              <Icon size={20} />

              {item.title}

            </NavLink>

          );

        })}

      </nav>

      {/* Logout */}

      

    </aside>

    <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-slate-950/80 md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-4 px-2 py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.title}
              to={item.path}
              aria-label={item.title}
              className={({ isActive }) => `flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${isActive ? "text-emerald-300" : "text-slate-400 hover:text-white"}`}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
    </>
  );
}

export default Sidebar;
