import {
  LayoutDashboard,
  BrainCircuit,
  History,
  BarChart3,
  Settings,
  User,
  LogOut,
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
    <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col">

      {/* Logo */}

      <div className="p-6 border-b border-slate-800">

        <h1 className="text-2xl font-bold text-white">
          XAU Strategy
        </h1>

        <p className="text-sm text-slate-400">
          Trading Analyzer
        </p>

      </div>

      {/* Menu */}

      <nav className="flex-1 px-4 py-6">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink

              key={item.title}

              to={item.path}

              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl mb-3 transition

                ${
                  isActive
                    ? "bg-green-600 text-white"
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
  );
}

export default Sidebar;