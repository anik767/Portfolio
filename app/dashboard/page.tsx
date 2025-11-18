"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Post = {
  _id: string;
  title: string;
  createdAt?: string;
};

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  async function checkAuthAndLoadData() {
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
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#2d3748",
              marginBottom: "10px"
            }}>
              Welcome Back! 👋
            </h2>
            <p style={{ color: "#718096", fontSize: "16px" }}>
              Manage your content and posts from here
            </p>
          </div>

          {/* Stats Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "40px"
          }}>
            <div style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderLeft: "4px solid #667eea"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: "#718096", fontSize: "14px", marginBottom: "8px", fontWeight: "600" }}>
                    Total Posts
                  </p>
                  <h3 style={{ fontSize: "36px", fontWeight: "700", color: "#2d3748", margin: 0 }}>
                    {posts.length}
                  </h3>
                </div>
                <div style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px"
                }}>
                  📝
                </div>
              </div>
            </div>

            <div style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderLeft: "4px solid #48bb78"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: "#718096", fontSize: "14px", marginBottom: "8px", fontWeight: "600" }}>
                    Active Posts
                  </p>
                  <h3 style={{ fontSize: "36px", fontWeight: "700", color: "#2d3748", margin: 0 }}>
                    {posts.length}
                  </h3>
                </div>
                <div style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px"
                }}>
                  ✅
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            marginBottom: "40px"
          }}>
            <h3 style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#2d3748",
              marginBottom: "20px"
            }}>
              Quick Actions
            </h3>
            <Link
              href="/dashboard/posts"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 28px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "16px",
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
              <span>➕</span> Create New Post
            </Link>
          </div>

          {/* Recent Posts */}
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#2d3748"
              }}>
                Recent Posts
              </h3>
              <Link
                href="/dashboard/posts"
                style={{
                  color: "#667eea",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "14px"
                }}
              >
                View All →
              </Link>
            </div>

            {posts.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#a0aec0"
              }}>
                <div style={{ fontSize: "48px", marginBottom: "20px" }}>📝</div>
                <p style={{ fontSize: "16px", marginBottom: "10px" }}>No posts yet</p>
                <p style={{ fontSize: "14px" }}>Create your first post to get started!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {posts.slice(0, 5).map((post) => (
                  <div
                    key={post._id}
                    style={{
                      padding: "16px",
                      background: "#f7fafc",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#edf2f7";
                      e.currentTarget.style.borderColor = "#cbd5e0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#f7fafc";
                      e.currentTarget.style.borderColor = "#e2e8f0";
                    }}
                  >
                    <div>
                      <h4 style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#2d3748",
                        marginBottom: "4px"
                      }}>
                        {post.title}
                      </h4>
                      <p style={{
                        fontSize: "12px",
                        color: "#a0aec0"
                      }}>
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                    <Link
                      href="/dashboard/posts"
                      style={{
                        color: "#667eea",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: "600"
                      }}
                    >
                      View →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

