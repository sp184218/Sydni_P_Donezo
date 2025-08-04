import React from "react";

export default function ShowToken() {
  // Get the bearer token from localStorage (or wherever you store it)
  const token = localStorage.getItem("supabase.auth.token") || "No token found";

  return (
    <div style={{ padding: "1rem", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
      <h2>Your Bearer Token</h2>
      <pre style={{ wordWrap: "break-word" }}>{token}</pre>
    </div>
  );
}
