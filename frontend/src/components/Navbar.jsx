import { useState } from "react";
import { Moon, Sun, UserCircle } from "lucide-react";
import ProfileModal from "./ProfileModal";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const pageTitle = ({ "/": "Dashboard", "/dashboard": "Dashboard", "/strategy": "Strategy builder", "/analytics": "Analytics", "/history": "Run history" })[location.pathname] || "XAU Strategy Analyzer";

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Guest";

  const displayEmail = user?.email || "Not logged in";

  return (
    <>
      <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/90 px-4 backdrop-blur sm:px-6 lg:px-10">
        {/* Left */}
        <div>
          <p className="text-lg font-semibold tracking-tight text-white sm:text-xl">{pageTitle}</p>

          <p className="hidden text-xs text-slate-400 sm:block sm:text-sm">
            Backtest and review your XAUUSD strategy
          </p>
        </div>

        {/* Center */}
        <div className="flex items-center gap-3 sm:gap-5">

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="flex size-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-300 transition hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            {theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>

          {user ? (
            /* Logged-in user */
            <button
              onClick={() => setShowProfileModal(true)}
              aria-label={`Open profile for ${displayName}`}
              className="flex items-center gap-2 text-left"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-[38px] h-[38px] rounded-full"
                />
              ) : (
                <UserCircle size={38} className="text-green-500" />
              )}

              <div>
                <h2 className="hidden max-w-36 truncate text-sm font-medium text-white sm:block">{displayName}</h2>

                <p className="hidden max-w-36 truncate text-xs text-slate-400 sm:block">{displayEmail}</p>
              </div>
            </button>
          ) : (
            /* Guest */
            <button
              onClick={() => setShowAuthModal(true)}
              className="min-h-10 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:px-5"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </header>

      {/* Authentication Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </>
  );
}

export default Navbar;
