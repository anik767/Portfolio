"use client";

import { useEffect, useState } from "react";
import { ModernInput } from "../components/ModernInput";

type AdminUser = {
  _id: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

type EditState = {
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
};

const createEditState = (email: string): EditState => ({
  email,
  password: "",
  confirmPassword: "",
  showPassword: false,
});

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editStates, setEditStates] = useState<Record<string, EditState>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin-users", { credentials: "include" });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to load users");
      }
      setUsers(data.users || []);
      const mapped: Record<string, EditState> = {};
      (data.users || []).forEach((user: AdminUser) => {
        mapped[user._id] = createEditState(user.email);
      });
      setEditStates(mapped);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateUser(id: string) {
    const state = editStates[id];
    if (!state) return;

    if (state.password || state.confirmPassword) {
      if (state.password !== state.confirmPassword) {
        setError("Passwords do not match. Please confirm the new password.");
        return;
      }
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin-users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id,
          email: state.email,
          password: state.password ? state.password : undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update user");
      }
      await fetchUsers();
      setEditStates((prev) => ({
        ...prev,
        [id]: createEditState(state.email),
      }));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto pt-12 lg:pt-0 space-y-6">
      <div className="bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white shadow-lg">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-2 flex items-center gap-2">
          <span>🛡️</span>
          <span>Admin Users</span>
        </h1>
        <p className="text-gray-300 text-sm sm:text-base">
          Manage who can access the admin dashboard.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 space-y-3 sm:space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Manage admins from the CLI</h3>
        <p className="text-sm text-gray-600">
          To create a new admin outside the dashboard, run:
        </p>
        <pre className="bg-gray-900 text-gray-100 rounded-lg px-4 py-3 text-sm overflow-auto">
          node user.js --email=you@example.com --password=StrongPass123
        </pre>
        <p className="text-sm text-gray-600">
          This script reads <code>MONGODB_URI</code> (and <code>.env.local</code> if present) and will
          insert or update the given account. Use the editor below to adjust an existing admin’s email
          or password.
        </p>
      </div>

      <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Existing Admins</h2>
          <span className="text-sm text-gray-500">{users.length} total</span>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No admin users yet.</div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => {
              const state =
                editStates[user._id] ||
                createEditState(user.email);
              const createdDate = user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Unknown";
              return (
                <div
                  key={user._id}
                  className="border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 bg-gray-50"
                >
                  <div>
                    <p className="text-sm text-gray-500">Created {createdDate}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ModernInput
                      label="Email"
                      value={state.email}
                      onChange={(e) =>
                        setEditStates((prev) => ({
                          ...prev,
                          [user._id]: { ...state, email: e.target.value },
                        }))
                      }
                      required
                      type="email"
                    />
                    <div className="sm:col-span-2 space-y-3">
                      <label className="block text-gray-700 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm uppercase tracking-wide">
                        New Password (optional)
                      </label>
                      <div className="relative">
                        <input
                          type={state.showPassword ? "text" : "password"}
                          value={state.password}
                          onChange={(e) =>
                            setEditStates((prev) => ({
                              ...prev,
                              [user._id]: { ...state, password: e.target.value },
                            }))
                          }
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-gray-800 bg-white"
                          placeholder="Leave blank to keep current password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setEditStates((prev) => ({
                              ...prev,
                              [user._id]: { ...state, showPassword: !state.showPassword },
                            }))
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label={state.showPassword ? "Hide password" : "Show password"}
                        >
                          {state.showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm uppercase tracking-wide">
                          Confirm Password
                        </label>
                        <input
                          type={state.showPassword ? "text" : "password"}
                          value={state.confirmPassword}
                          onChange={(e) =>
                            setEditStates((prev) => ({
                              ...prev,
                              [user._id]: { ...state, confirmPassword: e.target.value },
                            }))
                          }
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-gray-800 bg-white"
                          placeholder="Re-enter new password"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleUpdateUser(user._id)}
                      disabled={saving}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold shadow-sm hover:bg-gray-800 transition-all duration-200 disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() =>
                        setEditStates((prev) => ({
                          ...prev,
                          [user._id]: createEditState(user.email),
                        }))
                      }
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


