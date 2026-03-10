import { useState } from "react";
import api from "../services/api";

export default function CreateComment({ postId, onCreated }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await api.post(`/posts/${postId}/comments`, { content });
      setContent("");
      onCreated?.();
      alert("Comment added ✅");
    } catch (err) {
      alert(err?.response?.data?.message || "Create comment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <input
        className="comment-input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
      />
      <button type="submit" className="btn" disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
