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
};

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
        mapped[user._id] = {
          email: user.email,
          password: "",
        };
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
          password: state.password || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update user");
      }
      await fetchUsers();
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
              const state = editStates[user._id] || { email: user.email, password: "" };
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
                    <ModernInput
                      label="New Password (optional)"
                      value={state.password}
                      onChange={(e) =>
                        setEditStates((prev) => ({
                          ...prev,
                          [user._id]: { ...state, password: e.target.value },
                        }))
                      }
                      type="text"
                      placeholder="Leave blank to keep current password"
                      className="sm:col-span-2"
                    />
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
                          [user._id]: { email: user.email, password: "" },
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


