import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  BrainCircuit,
  History,
  BarChart3,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { title: "Dashboard",  icon: LayoutDashboard, path: "/" },
  { title: "Strategy",   icon: BrainCircuit,    path: "/strategy" },
  { title: "Analytics",  icon: BarChart3,        path: "/analytics" },
  { title: "History",    icon: History,          path: "/history" },
];

function SidebarLink({ item, onClick }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      aria-label={item.title}
      title={item.title}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3 py-2.5 mb-1 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
        ${isActive
          ? "bg-emerald-500 text-slate-950 font-semibold shadow-sm"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }
        `
      }
    >
      <Icon size={20} className="shrink-0" aria-hidden="true" />
      <span className="truncate text-sm">{item.title}</span>
    </NavLink>
  );
}

function Sidebar() {
  const [desktopOpen, setDesktopOpen] = useState(true);
  // mobileOpen: drawer visible on mobile/tablet
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change / resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Trap focus & close drawer on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileOpen]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const sidebarContent = (isDrawer = false) => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
        {
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold tracking-tight text-white">
              XAU <span className="text-emerald-400">Strategy</span>
            </h1>
            <p className="truncate text-xs text-slate-400">Trading Analyzer</p>
          </div>
        }
        {isDrawer && (
          <button type="button" onClick={closeMobile} aria-label="Close navigation" className="ml-auto flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav aria-label="Main navigation" className="flex-1 px-3 py-4">
        {menuItems.map((item) => (
          <SidebarLink
            key={item.title}
            item={item}
            onClick={isDrawer ? closeMobile : undefined}
          />
        ))}
      </nav>

    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setDesktopOpen((open) => !open)}
        aria-label={desktopOpen ? "Collapse sidebar" : "Open sidebar"}
        title={desktopOpen ? "Collapse sidebar" : "Open sidebar"}
        className={`fixed ${desktopOpen ? "left-[216px]" : "left-4"} top-4 z-40 hidden size-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-950 text-slate-300 shadow-lg transition-all duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 lg:flex`}
      >
        {desktopOpen ? <ChevronLeft size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>
      {/* ── Mobile hamburger button (shown below lg) ── */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
        aria-controls="mobile-sidebar"
        className="fixed left-4 top-4 z-50 flex size-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-950 text-slate-300 shadow-lg transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
          onClick={closeMobile}
        />
      )}

      {/* ── Mobile drawer panel ── */}
      <aside
        id="mobile-sidebar"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent(true)}
      </aside>

      {/* ── Desktop sidebar (lg and above) ── */}
      {desktopOpen && <aside
        aria-label="Main navigation"
        className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-slate-800/80 bg-slate-950 transition-all duration-200 lg:flex"
      >
        {sidebarContent(false)}
      </aside>}

      {/* ── Bottom tab bar (small mobile only, below lg) ── */}
      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-slate-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-slate-950/80 lg:hidden"
      >
        <div className="mx-auto grid max-w-lg grid-cols-4 px-2 py-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.title}
                to={item.path}
                aria-label={item.title}
                className={({ isActive }) =>
                  `flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    isActive ? "text-emerald-400" : "text-slate-400 hover:text-white"
                  }`
                }
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
