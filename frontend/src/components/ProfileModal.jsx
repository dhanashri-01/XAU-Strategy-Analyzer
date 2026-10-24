import { useEffect, useRef, useState } from "react";
import { LogOut, UserCircle, X, Pencil, Check, Camera } from "lucide-react";
import { updateProfile } from "firebase/auth";

import { useAuth } from "../context/AuthContext";

function ProfileModal({ onClose }) {
  const dialogRef = useRef(null);
  const { user, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(
    user?.displayName || user?.email?.split("@")[0] || "User",
  );

  const [saving, setSaving] = useState(false);

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

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
    dialogRef.current.querySelector("button")?.focus();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const handleSaveName = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    try {
      setSaving(true);

      await updateProfile(user, {
        displayName: trimmedName,
      });

      setIsEditing(false);

      window.location.reload();
    } catch (error) {
      console.error("Failed to update display name:", error);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const idToken = await user.getIdToken();

      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch(
        "http://localhost:5000/api/users/profile-photo",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile photo upload failed");
      }

      await updateProfile(user, {
        photoURL: data.photoURL,
      });

      window.location.reload();
    } catch (error) {
      console.error("Profile photo upload failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="profile-modal-title" className="my-auto w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">
          <h2 id="profile-modal-title" className="text-xl font-semibold text-white">Profile</h2>

          <button onClick={onClose} aria-label="Close profile dialog" className="flex size-10 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
            <X size={22} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-6 py-7">
          {/* Profile Photo */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
                />
              ) : (
                <UserCircle size={96} className="text-green-500" />
              )}

              <label
                htmlFor="profile-photo"
                aria-label="Upload profile photo"
                className="absolute bottom-0 right-0 flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-slate-900 bg-emerald-500 hover:bg-emerald-400"
              >
                <span className="sr-only">Upload profile photo</span>
                <Camera size={18} className="text-white" />
              </label>

              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="sr-only"
              />
            </div>
          </div>

          {/* Name */}
          <div className="text-center">
            {isEditing ? (
              <div className="flex items-center justify-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="Display name"
                  className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-emerald-400"
                  autoFocus
                />

                <button
                  onClick={handleSaveName}
                  aria-label="Save display name"
                  disabled={saving}
                  className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50"
                >
                  <Check size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-xl font-semibold text-white">
                  {displayName}
                </h3>

                <button
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit display name"
                  className="text-slate-400 hover:text-green-400"
                >
                  <Pencil size={16} />
                </button>
              </div>
            )}

            <p className="text-sm text-slate-400 mt-2">{user?.email}</p>
          </div>

          {/* Account Info */}
          <div className="mt-7 space-y-4">
            <div>
              <p className="text-xs text-slate-500">Display Name</p>

              <p className="text-white mt-1">{displayName}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Email</p>

              <p className="text-white mt-1">{user?.email}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 py-3 text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
