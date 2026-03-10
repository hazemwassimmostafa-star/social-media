import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function PostCard({ post, onDeleted, onUpdated }) {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const postId = post?._id || post?.id;

  const postUserId =
    post?.user?._id ||
    post?.postCreator?._id ||
    post?.createdBy?._id ||
    post?.user?.id ||
    post?.postCreator?.id ||
    post?.createdBy?.id;

  const myId = user?._id || user?.id;
  const canEditOrDelete = String(myId) === String(postUserId);

  const userName =
    post?.user?.name ||
    post?.postCreator?.name ||
    post?.createdBy?.name ||
    "User";

  const postText =
    post?.body ||
    post?.content ||
    post?.text ||
    post?.caption ||
    "";

  const postImage =
    post?.image ||
    post?.postImage ||
    post?.img ||
    post?.photo ||
    "";

  const [editBody, setEditBody] = useState(postText);

  const createdAtText = useMemo(() => {
    if (!post?.createdAt) return "";
    try {
      return new Date(post.createdAt).toLocaleString();
    } catch {
      return "";
    }
  }, [post?.createdAt]);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this post?");
    if (!confirmed) return;

    setLoadingDelete(true);
    try {
      await api.delete(`/posts/${postId}`);
      onDeleted?.();
      alert("Post deleted ✅");
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setLoadingDelete(false);
    }
  }

  function startEdit() {
    setEditBody(postText);
    setIsEditing(true);
  }

  function cancelEdit() {
    setEditBody(postText);
    setIsEditing(false);
  }

  async function saveEdit() {
    if (!editBody.trim()) {
      alert("Post content is required");
      return;
    }

    setLoadingEdit(true);
    try {
      await api.put(`/posts/${postId}`, { body: editBody });
      setIsEditing(false);
      onUpdated?.();
      alert("Post updated ✅");
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setLoadingEdit(false);
    }
  }

  return (
    <article className="card post-card">
      <div className="post-header">
        <div>
          <h4 className="post-user">{userName}</h4>
          {createdAtText ? <p className="post-date">{createdAtText}</p> : null}
        </div>

        {canEditOrDelete ? (
          <div className="post-actions">
            {!isEditing ? (
              <>
                <button type="button" className="btn btn-secondary" onClick={startEdit}>
                  Edit
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={loadingDelete}>
                  {loadingDelete ? "Deleting..." : "Delete"}
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn" onClick={saveEdit} disabled={loadingEdit}>
                  {loadingEdit ? "Saving..." : "Save"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                  Cancel
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>

      {!isEditing ? (
        postText ? <p className="post-body">{postText}</p> : null
      ) : (
        <textarea
          className="post-textarea"
          value={editBody}
          onChange={(e) => setEditBody(e.target.value)}
          rows={4}
        />
      )}

      {postImage ? <img src={postImage} alt="post" className="post-image" /> : null}

      <div className="post-footer">
        <Link to={`/posts/${postId}`} className="details-link">
          Details
        </Link>
      </div>
    </article>
  );
}
