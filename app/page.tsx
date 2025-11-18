"use client";

import { useState, useEffect } from "react";

type Post = {
  _id: string;
  title: string;
  content: string;
  category?: string;
  image?: string;
  createdAt?: string;
};

type Category = {
  _id: string;
  name: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        setError("");
        // Fetch posts
        const postsRes = await fetch("/api/posts", {
          cache: "no-store",
        });
        
        if (!postsRes.ok) {
          throw new Error(`HTTP error! status: ${postsRes.status}`);
        }
        
        const postsData = await postsRes.json();
        console.log("Posts API Response:", postsData); // Debug log
        
        if (postsData.success) {
          if (Array.isArray(postsData.posts)) {
            setPosts(postsData.posts);
            console.log(`Loaded ${postsData.posts.length} posts`); // Debug log
          } else {
            console.error("Posts is not an array:", postsData.posts);
            setPosts([]);
            setError("Invalid posts data format");
          }
        } else {
          console.error("API returned error:", postsData.error);
          setPosts([]);
          setError(postsData.error || "Failed to load posts");
        }

        // Fetch categories
        const categoriesRes = await fetch("/api/categories", {
          cache: "no-store",
        });
        
        if (!categoriesRes.ok) {
          console.warn("Categories fetch failed:", categoriesRes.status);
        } else {
          const categoriesData = await categoriesRes.json();
          console.log("Categories API Response:", categoriesData); // Debug log
          if (categoriesData.success && Array.isArray(categoriesData.categories)) {
            setCategories(categoriesData.categories);
          } else {
            setCategories([]);
          }
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        const errorMsg = err instanceof Error ? err.message : "Unknown error occurred";
        setError(`Error: ${errorMsg}`);
        setPosts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
    <div style={{
      minHeight: "100vh",
      background: "#f5f7fa",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <header style={{ marginBottom: "50px", textAlign: "center" }}>
          <h1 style={{
            fontSize: "3rem",
            marginBottom: "20px",
            color: "#2d3748",
            fontWeight: "700",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Welcome to Our Blog
          </h1>
          <p style={{
            fontSize: "1.2rem",
            color: "#718096",
            lineHeight: "1.6"
          }}>
            Discover our latest posts and stories
          </p>
        </header>

        {error && (
          <div style={{
            marginBottom: "30px",
            padding: "20px",
            background: "#fee",
            border: "1px solid #fcc",
            borderRadius: "8px",
            color: "#c33"
          }}>
            <strong>Error:</strong> {error}
            <br />
            <small style={{ marginTop: "8px", display: "block" }}>
              Check browser console (F12) for more details. Make sure your MongoDB connection is working.
            </small>
          </div>
        )}

        {posts.length === 0 && !loading ? (
          <div style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <div style={{ fontSize: "64px", marginBottom: "24px" }}>📝</div>
            <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#2d3748", marginBottom: "12px" }}>
              {error ? "Error loading posts" : "No posts yet"}
            </h2>
            <p style={{ fontSize: "16px", color: "#718096" }}>
              {error 
                ? "Please check your database connection and try again." 
                : "Check back soon for new content!"}
            </p>
            {error && (
              <div style={{ marginTop: "20px", fontSize: "14px", color: "#999" }}>
                <p>Debug steps:</p>
                <ul style={{ textAlign: "left", display: "inline-block", marginTop: "10px" }}>
                  <li>Check MongoDB connection string in environment variables</li>
                  <li>Verify database name is &quot;mydb&quot;</li>
                  <li>Check if &quot;posts&quot; collection exists</li>
                  <li>Visit /api/test-db to test connection</li>
                </ul>
              </div>
            )}
          </div>
        ) : posts.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "30px"
          }}>
            {posts.map((post) => (
              <div
                key={post._id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  transition: "all 0.3s",
                  display: "flex",
                  flexDirection: "column"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                }}
              >
                {post.image && (
                  <div style={{
                    width: "100%",
                    height: "250px",
                    overflow: "hidden",
                    background: "#e2e8f0"
                  }}>
                    <img
                      src={post.image}
                      alt={post.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                )}
                <div style={{ padding: "24px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <h2 style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#2d3748",
                      margin: 0,
                      lineHeight: "1.3",
                      flex: 1
                    }}>
                      {post.title}
                    </h2>
                    {post.category && (
                      <span style={{
                        padding: "6px 14px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        borderRadius: "20px",
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
                    fontSize: "15px",
                    color: "#718096",
                    lineHeight: "1.6",
                    marginBottom: "16px",
                    flexGrow: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical"
                  }}>
                    {post.content}
                  </p>
                  {post.createdAt && (
                    <div style={{
                      paddingTop: "16px",
                      borderTop: "1px solid #e2e8f0",
                      fontSize: "13px",
                      color: "#a0aec0"
                    }}>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
