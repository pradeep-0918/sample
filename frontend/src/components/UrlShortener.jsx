import { useState } from "react";
import axios from "axios";

// Base URL of your backend API
const API_BASE = "http://localhost:5000";

function UrlShortener() {
  // ── State ─────────────────────────────────
  const [longUrl, setLongUrl]   = useState("");       // What user types
  const [shortUrl, setShortUrl] = useState("");       // Result from API
  const [loading, setLoading]   = useState(false);   // Show spinner
  const [error, setError]       = useState("");       // Error message
  const [copied, setCopied]     = useState(false);   // Copy feedback

  // ── Submit Handler ────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload on form submit

    // Reset previous state
    setError("");
    setShortUrl("");

    // Basic client-side validation before sending to server
    if (!longUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    // Optional: basic URL format check on frontend too
    try {
      new URL(longUrl);
    } catch {
      setError("Please enter a valid URL (include https://)");
      return;
    }

    setLoading(true);

    try {
      // POST request to backend
      // axios automatically serializes the object to JSON
      // and sets Content-Type: application/json
      const response = await axios.post(`${API_BASE}/api/shorten`, { longUrl });

      // response.data is the parsed JSON from the server
      // { shortUrl: "http://localhost:5000/abc12345" }
      setShortUrl(response.data.shortUrl);

    } catch (err) {
      // err.response exists if server returned an error (4xx, 5xx)
      // err.message exists if network failed (no internet, CORS, etc.)
      if (err.response) {
        setError(err.response.data.error || "Something went wrong");
      } else {
        setError("Network error. Is the backend running?");
      }
    } finally {
      // Always runs — whether success or error
      // Hides the loading spinner
      setLoading(false);
    }
  };

  // ── Copy to Clipboard ─────────────────────
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      // Reset "Copied!" back to "Copy" after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  // ── Render ─────────────────────────────────
  return (
    <div className="container">
      <h1>🔗 URL Shortener</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter long URL (https://...)"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>

      {/* Error display — only renders if error is non-empty */}
      {error && <p className="error">{error}</p>}

      {/* Result display — only renders if shortUrl is non-empty */}
      {shortUrl && (
        <div className="result">
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
          <button onClick={handleCopy}>
            {copied ? "✅ Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}

export default UrlShortener;