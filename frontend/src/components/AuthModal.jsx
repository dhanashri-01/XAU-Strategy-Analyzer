import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";

function AuthModal({ onClose }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dialogRef = useRef(null);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "Tab") {
        const controls = [...dialogRef.current.querySelectorAll("button:not([disabled]), input:not([disabled])")]
          .filter((control) => control.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    dialogRef.current.querySelector("input")?.focus();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (isSignup) await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (authError) {
      setError(authError.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      onClose();
    } catch (authError) {
      setError(authError.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" className="my-auto w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 id="auth-modal-title" className="text-2xl font-bold text-white">
            {isSignup ? "Create account" : "Welcome back"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close sign in dialog" className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-400">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="auth-email">Email address</label>
          <input id="auth-email" type="email" placeholder="Email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mb-4 min-h-12 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none" required />

          <label className="sr-only" htmlFor="auth-password">Password</label>
          <input id="auth-password" type="password" placeholder="Password" autoComplete={isSignup ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="mb-4 min-h-12 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none" required />

          {error && <p role="alert" className="mb-4 text-sm text-rose-300">{error}</p>}

          <button type="submit" className="min-h-12 w-full rounded-lg bg-emerald-400 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-200">
            {isSignup ? "Create account" : "Sign in"}
          </button>
        </form>

        <div className="my-5 flex items-center">
          <div className="flex-1 border-t border-slate-700" />
          <span className="px-3 text-sm text-slate-500">or</span>
          <div className="flex-1 border-t border-slate-700" />
        </div>

        <button type="button" onClick={handleGoogleLogin} className="min-h-12 w-full rounded-lg bg-white py-3 font-semibold text-slate-900 transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-emerald-300">
          Continue with Google
        </button>

        <p className="mt-5 text-center text-sm text-slate-400">
          {isSignup ? "Already have an account?" : "New here?"}
          <button type="button" onClick={() => { setIsSignup(!isSignup); setError(""); }} className="ml-2 font-medium text-emerald-300 hover:text-emerald-200 focus-visible:rounded-sm">
            {isSignup ? "Sign in" : "Create an account"}
          </button>
        </p>
      </section>
    </div>
  );
}

export default AuthModal;
