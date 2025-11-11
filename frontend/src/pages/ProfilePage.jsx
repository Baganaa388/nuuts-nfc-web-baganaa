import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";

function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    profession: "",
    phone: "",
    bio: "",
    gender: "other",
  });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.getUserProfile(id);
        if (mounted) {
          setUser(data);
          setFormData({
            name: data.name || "",
            nickname: data.nickname || "",
            profession: data.profession || "",
            phone: data.phone || "",
            bio: data.bio || "",
            gender: data.gender || "other",
          });
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="hero">
        <div className="hero-title">Уншиж байна...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="hero">
        <div className="hero-title">Алдаа</div>
        <div className="hero-sub">{error || "Хэрэглэгч олдсонгүй"}</div>
        <p className="mt-6">
          <Link to="/" className="btn btn-outline">
            ← Leaderboard руу буцах
          </Link>
        </p>
      </div>
    );
  }

  const label = user.label || `Player ${user.id}`;
  // Format created_ts to 'Mon YYYY' (e.g., Nov 2025)
  function formatJoinDate(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    if (isNaN(d)) return ts;
    return d.toLocaleString("en-US", { month: "short", year: "numeric" });
  }

  const joined = formatJoinDate(user.created_ts);

  const toggleEdit = () => {
    if (isEditing) {
      setFormData({
        name: user.name || "",
        nickname: user.nickname || "",
        profession: user.profession || "",
        phone: user.phone || "",
        bio: user.bio || "",
        gender: user.gender || "other",
      });
      setEditError(null);
    }
    setIsEditing(!isEditing);
  };

  const cancelEdit = () => {
    setFormData({
      name: user.name || "",
      nickname: user.nickname || "",
      profession: user.profession || "",
      phone: user.phone || "",
      bio: user.bio || "",
      gender: user.gender || "other",
    });
    setEditError(null);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    if (!formData.name || formData.name.trim() === "") {
      setEditError("Name is required");
      return;
    }

    setSaving(true);
    setEditError(null);

    try {
      const response = await api.updateUserProfile(id, {
        name: formData.name.trim(),
        nickname: formData.nickname.trim() || null,
        profession: formData.profession.trim() || null,
        phone: formData.phone.trim() || null,
        bio: formData.bio.trim() || null,
        gender: formData.gender || "other",
      });

      if (response.ok && response.data) {
        setUser(response.data);
        setIsEditing(false);
      } else {
        setEditError(response.error?.message || "Failed to update profile");
      }
    } catch (err) {
      setEditError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[60vh] bg-white dark:bg-slate-900 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-amber-50 to-amber-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl shadow-xl p-6 sm:p-8 relative">
        {/* Pencil/Close Icon Button */}
        <button
          type="button"
          aria-label={isEditing ? "Cancel editing" : "Edit profile"}
          onClick={toggleEdit}
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-amber-400/40 dark:focus:ring-amber-500/40 flex items-center justify-center"
        >
          {isEditing ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          )}
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left column: avatar and basic */}
          <div className="lg:col-span-3 flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-full bg-amber-400 dark:bg-amber-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="text-lg font-semibold text-gray-800 dark:text-slate-100">
              {user.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-slate-400">
              @{user.nickname || label}
            </div>
            {user.profession && (
              <div className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm mt-2">
                {user.profession}
              </div>
            )}
          </div>

          {/* Right column: profile info */}
          <div className="lg:col-span-9 bg-white/40 dark:bg-slate-800/40 rounded-lg p-4 sm:p-6 relative">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-200 mb-4">
              Profile Information
            </h3>

            {/* Error Message */}
            {editError && (
              <div className="mb-4 p-4 bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{editError}</p>
              </div>
            )}

            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-slate-400 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={saving}
                      required
                      className="w-full rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/30 dark:focus:ring-amber-500/30 disabled:opacity-60"
                    />
                  </div>

                  {/* Nickname */}
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-slate-400 mb-2">
                      Nickname
                    </label>
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                      disabled={saving}
                      className="w-full rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/30 dark:focus:ring-amber-500/30 disabled:opacity-60"
                    />
                  </div>

                  {/* Profession */}
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-slate-400 mb-2">
                      Profession
                    </label>
                    <input
                      type="text"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      disabled={saving}
                      className="w-full rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/30 dark:focus:ring-amber-500/30 disabled:opacity-60"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-slate-400 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={saving}
                      className="w-full rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/30 dark:focus:ring-amber-500/30 disabled:opacity-60"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-slate-400 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      disabled={saving}
                      className="w-full rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/30 dark:focus:ring-amber-500/30 disabled:opacity-60"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* UID - Read-only */}
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-slate-400 mb-2">
                      UID
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={user.uid || ""}
                      className="w-full rounded-lg px-3 py-2 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-mono text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Bio - Full Width */}
                <div>
                  <label className="block text-xs text-gray-500 dark:text-slate-400 mb-2">
                    About
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={saving}
                    rows={3}
                    className="w-full rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/30 dark:focus:ring-amber-500/30 disabled:opacity-60 resize-none"
                  />
                </div>

                {/* Total Contribution - Read-only */}
                <div>
                  <label className="block text-xs text-gray-500 dark:text-slate-400 mb-2">
                    Total Contribution
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={user.total || 0}
                    className="w-full rounded-lg px-3 py-2 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-mono text-sm cursor-not-allowed"
                  />
                </div>

                {/* Save/Cancel Buttons */}
                <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={saving}
                    className="rounded-xl px-4 py-2.5 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:shadow transition disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={saveProfile}
                    className="rounded-xl px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 dark:bg-amber-600 dark:hover:bg-amber-500 dark:text-slate-900 shadow focus:outline-none focus:ring-2 focus:ring-amber-400/40 disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">Full Name</div>
                    <div className="font-medium text-gray-800 dark:text-slate-200">{user.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">Nickname</div>
                    <div className="font-medium text-gray-800 dark:text-slate-200">
                      {user.nickname || "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">UID</div>
                    <div className="mt-1">
                      <input
                        type="text"
                        readOnly
                        value={user.uid || ""}
                        className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md px-3 py-2 font-mono text-sm text-gray-700 dark:text-slate-300"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">Phone</div>
                    <div className="font-medium text-gray-800 dark:text-slate-200">
                      {user.phone || "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">Gender</div>
                    <div className="font-medium text-gray-800 dark:text-slate-200">
                      {user.gender || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">Joined</div>
                    <div className="font-medium text-gray-800 dark:text-slate-200">{joined || "-"}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                    About
                  </h4>
                  <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 p-4 text-sm text-gray-700 dark:text-slate-300">
                    {user.bio || "—"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
