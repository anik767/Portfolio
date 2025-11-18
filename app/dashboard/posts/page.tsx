"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Post = {
  _id: string;
  title: string;
  content: string;
  category?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

type Category = {
  _id: string;
  name: string;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "", category: "", image: null as File | null });
  const [existingImage, setExistingImage] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAuthAndLoadPosts() {
    try {
      const res = await fetch("/api/auth/check", {
        credentials: "include",
      });
      const data = await res.json();
      if (!data.authenticated) {
        router.push("/admin");
        return;
      }
      loadPosts();
      loadCategories();
    } catch (err) {
      console.error("Auth check failed:", err);
      router.push("/admin");
    }
  }

  async function loadPosts() {
    try {
      const res = await fetch("/api/posts", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
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
    }
  }

  function handleNewPost() {
    setEditingPost(null);
    setFormData({ title: "", content: "", category: "", image: null });
    setExistingImage("");
    setShowForm(true);
  }

  function handleEdit(post: Post) {
    setEditingPost(post);
    setFormData({ title: post.title, content: post.content, category: post.category || "", image: null });
    setExistingImage(post.image || "");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      if (formData.category) {
        formDataToSend.append("category", formData.category);
      }
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      if (existingImage && !formData.image) {
        formDataToSend.append("existingImage", existingImage);
      }

      let url = "/api/posts";
      let method = "POST";

      if (editingPost) {
        url = "/api/posts";
        method = "PUT";
        formDataToSend.append("id", editingPost._id);
      }

      const res = await fetch(url, {
        method,
        credentials: "include",
        body: formDataToSend,
      });

      const data = await res.json();

      if (data.success) {
        setMessage(editingPost ? "Post updated successfully!" : "Post created successfully!");
        setShowForm(false);
        setFormData({ title: "", content: "", category: "", image: null });
        setExistingImage("");
        setEditingPost(null);
        await loadPosts();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "Failed to save post");
      }
    } catch {
      setMessage("An error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Post deleted successfully!");
        await loadPosts();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "Failed to delete post");
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
            <span>📝</span> Posts
          </Link>
          <Link
            href="/dashboard/categories"
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
                Posts Management
              </h2>
              <p style={{ color: "#718096", fontSize: "16px" }}>
                Create, edit, and manage your posts
              </p>
            </div>
            <button
              onClick={handleNewPost}
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
              ➕ New Post
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
                {editingPost ? "✏️ Edit Post" : "➕ Create New Post"}
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
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
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

              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#2d3748",
                  fontSize: "14px"
                }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "14px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                    background: "white",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                >
                  <option value="">Select a category (optional)</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: "12px", color: "#a0aec0", marginTop: "8px" }}>
                  Manage categories in the <Link href="/dashboard/categories" style={{ color: "#667eea", textDecoration: "none", fontWeight: "600" }}>Categories</Link> page
                </p>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#2d3748",
                  fontSize: "14px"
                }}>
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={8}
                  style={{
                    width: "100%",
                    padding: "14px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    resize: "vertical",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#2d3748",
                  fontSize: "14px"
                }}>
                  Image
                </label>
                {existingImage && (
                  <div style={{
                    marginBottom: "12px",
                    padding: "12px",
                    background: "#f7fafc",
                    borderRadius: "8px"
                  }}>
                    <p style={{ fontSize: "14px", color: "#718096", marginBottom: "8px" }}>Current image:</p>
                    <img
                      src={existingImage}
                      alt="Current"
                      style={{
                        maxWidth: "200px",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0"
                      }}
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  style={{
                    width: "100%",
                    padding: "14px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                    background: "white",
                    cursor: "pointer"
                  }}
                />
                <p style={{ fontSize: "12px", color: "#a0aec0", marginTop: "8px" }}>
                  {editingPost ? "Leave empty to keep current image" : "Optional - Upload an image for your post"}
                </p>
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
                  onMouseEnter={(e) => {
                    if (!saving) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!saving) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
                    }
                  }}
                >
                  {saving ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPost(null);
                    setFormData({ title: "", content: "", category: "", image: null });
                    setExistingImage("");
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
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "24px"
          }}>
            {posts.length === 0 ? (
              <div style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "80px 20px",
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}>
                <div style={{ fontSize: "64px", marginBottom: "24px" }}>📝</div>
                <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#2d3748", marginBottom: "8px" }}>
                  No posts yet
                </h3>
                <p style={{ fontSize: "16px", color: "#718096", marginBottom: "24px" }}>
                  Click &quot;New Post&quot; to create your first post!
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post._id}
                  style={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    transition: "all 0.2s",
                    display: "flex",
                    flexDirection: "column"
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
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "16px",
                        border: "1px solid #e2e8f0"
                      }}
                    />
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <h3 style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#2d3748",
                      lineHeight: "1.4",
                      flex: 1
                    }}>
                      {post.title}
                    </h3>
                    {post.category && (
                      <span style={{
                        padding: "4px 12px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        marginLeft: "12px",
                        whiteSpace: "nowrap"
                      }}>
                        {categories.find(c => c._id === post.category)?.name || "Category"}
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontSize: "14px",
                    color: "#718096",
                    marginBottom: "16px",
                    whiteSpace: "pre-wrap",
                    flexGrow: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical"
                  }}>
                    {post.content}
                  </p>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "16px",
                    borderTop: "1px solid #e2e8f0"
                  }}>
                    <span style={{
                      fontSize: "12px",
                      color: "#a0aec0",
                      fontWeight: "500"
                    }}>
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : ""}
                    </span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleEdit(post)}
                        style={{
                          padding: "8px 16px",
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
                        onClick={() => handleDelete(post._id)}
                        style={{
                          padding: "8px 16px",
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
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

