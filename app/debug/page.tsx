"use client";

import { useState } from "react";

export default function DebugPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function testConnection() {
    setLoading(true);
    setTestResults(null);

    try {
      const res = await fetch("/api/test-db");
      const data = await res.json();
      setTestResults(data);
    } catch (err) {
      setTestResults({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }

  async function testPosts() {
    setLoading(true);
    setTestResults(null);

    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setTestResults(data);
    } catch (err) {
      setTestResults({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "30px" }}>Debug & Test Page</h1>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={testConnection}
          disabled={loading}
          style={{
            padding: "12px 24px",
            background: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          Test Database Connection
        </button>
        <button
          onClick={testPosts}
          disabled={loading}
          style={{
            padding: "12px 24px",
            background: "#48bb78",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          Test Posts API
        </button>
      </div>

      {loading && <p>Testing...</p>}

      {testResults && (
        <div
          style={{
            padding: "20px",
            background: testResults.success ? "#d4edda" : "#f8d7da",
            border: `1px solid ${testResults.success ? "#c3e6cb" : "#f5c6cb"}`,
            borderRadius: "4px",
            marginTop: "20px",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>
            {testResults.success ? "✅ Success" : "❌ Error"}
          </h3>
          <pre
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "4px",
              overflow: "auto",
              fontSize: "12px",
            }}
          >
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: "40px", padding: "20px", background: "#f7fafc", borderRadius: "4px" }}>
        <h3>Environment Check:</h3>
        <ul>
          <li>MONGODB_URI: {process.env.NEXT_PUBLIC_SHOW_URI ? "Set" : "Check server logs"}</li>
          <li>Node Environment: {process.env.NODE_ENV || "unknown"}</li>
        </ul>
        <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
          Note: Environment variables are only available on the server. Check your terminal/server logs for connection details.
        </p>
      </div>
    </div>
  );
}

