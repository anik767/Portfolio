"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
  _id: string;
  name: string;
  createdAt?: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAuthAndLoadCategories() {
    try {
      const res = await fetch("/api/auth/check", {
        credentials: "include",
      });
      const data = await res.json();
      if (!data.authenticated) {
        router.push("/admin");
        return;
      }
      loadCategories();
    } catch (err) {
      console.error("Auth check failed:", err);
      router.push("/admin");
    }
  }

  async function loadCategories() {
    try {
      const res = await fetch("/api/categories", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleNewCategory() {
    setEditingCategory(null);
    setFormData({ name: "" });
    setShowForm(true);
  }

  function handleEdit(category: Category) {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) {
      setMessage("Category name cannot be empty");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      if (editingCategory) {
        // Update category - we'll need to add PUT endpoint
        const res = await fetch("/api/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: editingCategory._id, name: formData.name.trim() }),
        });

        const data = await res.json();

        if (data.success) {
          setMessage("Category updated successfully!");
          setShowForm(false);
          setFormData({ name: "" });
          setEditingCategory(null);
          await loadCategories();
          setTimeout(() => setMessage(""), 3000);
        } else {
          setMessage(data.error || "Failed to update category");
        }
      } else {
        // Create category
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: formData.name.trim() }),
        });

        const data = await res.json();

        if (data.success) {
          setMessage("Category created successfully!");
          setShowForm(false);
          setFormData({ name: "" });
          await loadCategories();
          setTimeout(() => setMessage(""), 3000);
        } else {
          setMessage(data.error || "Failed to create category");
        }
      }
    } catch {
      setMessage("An error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const res = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Category deleted successfully!");
        await loadCategories();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "Failed to delete category");
      }
    } catch {
      setMessage("An error occurred. Please try again.");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/admin");
  }

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}>
        <div style={{ color: "white", fontSize: "18px" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      {/* Sidebar */}
      <div style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "260px",
        height: "100vh",
        background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "30px 20px",
        boxShadow: "2px 0 10px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "40px",
          paddingBottom: "20px",
          borderBottom: "1px solid rgba(255,255,255,0.2)"
        }}>
          Dashboard
        </h1>
        
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link
            href="/dashboard"
            style={{
              padding: "12px 16px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "white",
              textDecoration: "none",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            <span>📊</span> Overview
          </Link>
          <Link
            href="/dashboard/posts"
            style={{
              padding: "12px 16px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "white",
              textDecoration: "none",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            <span>📝</span> Posts
          </Link>
          <Link
            href="/dashboard/categories"
            style={{
              padding: "12px 16px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "8px",
              color: "white",
              textDecoration: "none",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              transition: "all 0.2s"
            }}
          >
            <span>🏷️</span> Categories
          </Link>
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "30px" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: "260px", padding: "40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <div>
              <h2 style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#2d3748",
                marginBottom: "10px"
              }}>
                Categories Management
              </h2>
              <p style={{ color: "#718096", fontSize: "16px" }}>
                Create, edit, and manage your post categories
              </p>
            </div>
            <button
              onClick={handleNewCategory}
              style={{
                padding: "14px 28px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
              }}
            >
              ➕ New Category
            </button>
          </div>

          {message && (
            <div style={{
              marginBottom: "20px",
              padding: "16px",
              background: message.includes("success") ? "#d4edda" : "#f8d7da",
              color: message.includes("success") ? "#155724" : "#721c24",
              borderRadius: "8px",
              borderLeft: `4px solid ${message.includes("success") ? "#48bb78" : "#e53e3e"}`
            }}>
              {message}
            </div>
          )}

          {showForm && (
            <div style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              marginBottom: "30px"
            }}>
              <h3 style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#2d3748",
                marginBottom: "24px"
              }}>
                {editingCategory ? "✏️ Edit Category" : "➕ Create New Category"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#2d3748",
                    fontSize: "14px"
                  }}>
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    required
                    placeholder="Enter category name"
                    style={{
                      width: "100%",
                      padding: "14px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "16px",
                      boxSizing: "border-box",
                      transition: "all 0.2s"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                  />
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      padding: "14px 32px",
                      background: saving ? "#cbd5e0" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      cursor: saving ? "not-allowed" : "pointer",
                      fontWeight: "600",
                      boxShadow: saving ? "none" : "0 4px 12px rgba(102, 126, 234, 0.4)",
                      transition: "all 0.2s"
                    }}
                  >
                    {saving ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCategory(null);
                      setFormData({ name: "" });
                    }}
                    style={{
                      padding: "14px 32px",
                      background: "#e2e8f0",
                      color: "#4a5568",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      cursor: "pointer",
                      fontWeight: "600",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#cbd5e0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#e2e8f0";
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px"
          }}>
            {categories.length === 0 ? (
              <div style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "80px 20px",
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}>
                <div style={{ fontSize: "64px", marginBottom: "24px" }}>🏷️</div>
                <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#2d3748", marginBottom: "8px" }}>
                  No categories yet
                </h3>
                <p style={{ fontSize: "16px", color: "#718096", marginBottom: "24px" }}>
                  Click &quot;New Category&quot; to create your first category!
                </p>
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category._id}
                  style={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    transition: "all 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                  }}
                >
                  <div>
                    <h3 style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#2d3748",
                      marginBottom: "12px"
                    }}>
                      {category.name}
                    </h3>
                    {category.createdAt && (
                      <p style={{
                        fontSize: "12px",
                        color: "#a0aec0",
                        fontWeight: "500"
                      }}>
                        Created: {new Date(category.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                  <div style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "16px",
                    paddingTop: "16px",
                    borderTop: "1px solid #e2e8f0"
                  }}>
                    <button
                      onClick={() => handleEdit(category)}
                      style={{
                        flex: 1,
                        padding: "10px 16px",
                        background: "#667eea",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#5568d3";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#667eea";
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      style={{
                        flex: 1,
                        padding: "10px 16px",
                        background: "#e53e3e",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#c53030";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#e53e3e";
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

