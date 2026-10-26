import { useState } from "react";
import { Moon, Sun, UserCircle } from "lucide-react";
import ProfileModal from "./ProfileModal";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const PAGE_TITLES = {
  "/":          "Dashboard",
  "/dashboard": "Dashboard",
  "/strategy":  "Strategy Builder",
  "/analytics": "Analytics",
  "/history":   "Run History",
};

function Navbar() {
  const [showAuthModal,    setShowAuthModal]    = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { user }           = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location           = useLocation();

  const pageTitle   = PAGE_TITLES[location.pathname] ?? "XAU Strategy Analyzer";
  const displayName = user?.displayName || user?.email?.split("@")[0] || "Guest";
  const displayEmail = user?.email || "Not signed in";

  return (
    <>
      <header
        className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur
          /* Leave room for hamburger on mobile */
          pl-16 pr-4 sm:pl-16 sm:pr-6 lg:pl-16 lg:pr-10"
      >
        {/* Left — page title */}
        <div className="min-w-0">
          <p className="truncate text-base font-semibold tracking-tight text-white sm:text-lg lg:text-xl">
            {pageTitle}
          </p>
          <p className="hidden text-xs text-slate-400 sm:block">
            Backtest and review your XAUUSD strategy
          </p>
        </div>

        {/* Right — theme toggle + auth */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="flex size-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-300 transition hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            {theme === "dark"
              ? <Sun  size={18} aria-hidden="true" />
              : <Moon size={18} aria-hidden="true" />}
          </button>

          {user ? (
            /* Logged-in user */
            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              aria-label={`Open profile for ${displayName}`}
              className="flex items-center gap-2 text-left"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="size-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <UserCircle size={36} className="shrink-0 text-emerald-500" />
              )}
              <div className="hidden sm:block">
                <p className="max-w-[9rem] truncate text-sm font-medium text-white">{displayName}</p>
                <p className="max-w-[9rem] truncate text-xs text-slate-400">{displayEmail}</p>
              </div>
            </button>
          ) : (
            /* Guest — optional sign-in */
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="min-h-10 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:px-5"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {showAuthModal    && <AuthModal    onClose={() => setShowAuthModal(false)}    />}
      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
    </>
  );
}

export default Navbar;
