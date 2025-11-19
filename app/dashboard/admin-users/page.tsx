"use client";

import { useEffect, useState } from "react";
import { ModernInput } from "../components/ModernInput";

type AdminUser = {
  _id: string;
  email: string;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
};

type EditState = {
  email: string;
  password: string;
  status: string;
};

const defaultNewUser = { email: "", password: "", status: "1" };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState(defaultNewUser);
  const [saving, setSaving] = useState(false);
  const [editStates, setEditStates] = useState<Record<string, EditState>>({});
  const [migrationStatus, setMigrationStatus] = useState<{ running: boolean; message: string }>({
    running: false,
    message: "",
  });

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
          status: String(user.status ?? 1),
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

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
          status: parseInt(newUser.status, 10),
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to create user");
      }
      setNewUser(defaultNewUser);
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setSaving(false);
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
          status: parseInt(state.status, 10),
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

  async function handleDeleteUser(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin-users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to delete user");
      }
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setSaving(false);
    }
  }

  async function handleMigration() {
    setMigrationStatus({ running: true, message: "" });
    setError("");
    try {
      const res = await fetch("/api/admin-users/migrate", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Migration failed");
      }
      setMigrationStatus({
        running: false,
        message: data.message || `Migrated ${data.migrated} users`,
      });
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setMigrationStatus({
        running: false,
        message: err instanceof Error ? err.message : "Migration failed",
      });
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Admin</h2>
          <form className="space-y-4" onSubmit={handleCreateUser}>
            <ModernInput
              label="Email"
              value={newUser.email}
              onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
              required
              type="email"
            />
            <ModernInput
              label="Password"
              value={newUser.password}
              onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
              required
              type="password"
            />
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-xs sm:text-sm uppercase tracking-wide">
                Status
              </label>
              <select
                value={newUser.status}
                onChange={(e) => setNewUser((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 bg-white"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 sm:py-4 px-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg transition-all duration-200 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Create Admin"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Legacy Migration</h3>
            <p className="text-sm text-gray-600 mb-4">
              If you previously stored admin accounts in the general users collection, migrate them
              into the new admin_users collection with hashed passwords.
            </p>
            <button
              onClick={handleMigration}
              disabled={migrationStatus.running}
              className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-all duration-200 disabled:opacity-60"
            >
              {migrationStatus.running ? "Migrating..." : "Migrate Legacy Users"}
            </button>
            {migrationStatus.message && (
              <p className="text-sm text-gray-600 mt-3">{migrationStatus.message}</p>
            )}
          </div>
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 text-sm text-gray-600">
            <p className="font-semibold mb-1">Tips</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Use strong passwords for every admin account.</li>
              <li>Deactivate accounts immediately when no longer needed.</li>
              <li>Keep at least one backup admin user.</li>
            </ul>
          </div>
        </div>
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
              const state = editStates[user._id] || { email: user.email, password: "", status: "1" };
              const createdDate = user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Unknown";
              return (
                <div
                  key={user._id}
                  className="border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 bg-gray-50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Created {createdDate}</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          user.status === 1
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-sm text-red-600 hover:text-red-700 font-semibold"
                      disabled={saving}
                    >
                      Delete
                    </button>
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
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm uppercase tracking-wide">
                        Status
                      </label>
                      <select
                        value={state.status}
                        onChange={(e) =>
                          setEditStates((prev) => ({
                            ...prev,
                            [user._id]: { ...state, status: e.target.value },
                          }))
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 bg-white"
                      >
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </div>
                    <ModernInput
                      label="New Password (optional)"
                      value={state.password}
                      onChange={(e) =>
                        setEditStates((prev) => ({
                          ...prev,
                          [user._id]: { ...state, password: e.target.value },
                        }))
                      }
                      type="password"
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
                          [user._id]: { email: user.email, password: "", status: String(user.status ?? 1) },
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


