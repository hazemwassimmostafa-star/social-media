import { useState } from "react";
import api from "../services/api";

export default function CreatePost({ onCreated }) {
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!body.trim() && !image) {
      alert("Write something or choose an image");
      return;
    }

    const formData = new FormData();
    formData.append("body", body);

    if (image) {
      formData.append("image", image);
    }

    setLoading(true);

    try {
      await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setBody("");
      setImage(null);
      onCreated?.();
      alert("Post created ✅");
    } catch (err) {
      alert(err?.response?.data?.message || "Create post failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card composer-card">
      <h3 className="section-title">Create Post</h3>

      <form className="post-form" onSubmit={handleSubmit}>
        <textarea
          className="post-textarea"
          placeholder="What's on your mind?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
        />

        <div className="form-row">
          <input
            className="file-input"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>

        {image ? <p className="helper-text">Selected: {image.name}</p> : null}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Posting..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
