import { useMemo, useState } from "react";

export default function CommentItem({ comment, onDelete, onUpdate, canEdit }) {
  const commentId = comment?._id || comment?.id;
  const [isEditing, setIsEditing] = useState(false);

  const commentText =
    comment?.content ||
    comment?.body ||
    comment?.text ||
    comment?.comment ||
    "";

  const userName =
    comment?.user?.name ||
    comment?.commentCreator?.name ||
    comment?.createdBy?.name ||
    "User";

  const [value, setValue] = useState(commentText);

  const createdAtText = useMemo(() => {
    if (!comment?.createdAt) return "";
    try {
      return new Date(comment.createdAt).toLocaleString();
    } catch {
      return "";
    }
  }, [comment?.createdAt]);

  function startEdit() {
    setValue(commentText);
    setIsEditing(true);
  }

  function cancelEdit() {
    setValue(commentText);
    setIsEditing(false);
  }

  async function saveEdit() {
    if (!value.trim()) return;
    await onUpdate(commentId, value);
    setIsEditing(false);
  }

  return (
    <article className="comment-card">
      <div className="comment-top">
        <div>
          <h5 className="comment-user">{userName}</h5>
          {createdAtText ? <p className="comment-date">{createdAtText}</p> : null}
        </div>

        {canEdit ? (
          <div className="comment-actions">
            {!isEditing ? (
              <>
                <button type="button" className="btn btn-secondary" onClick={startEdit}>
                  Edit
                </button>
                <button type="button" className="btn btn-danger" onClick={() => onDelete(commentId)}>
                  Delete
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn" onClick={saveEdit}>
                  Save
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
        <p className="comment-body">{commentText || "No content"}</p>
      ) : (
        <textarea
          className="post-textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
        />
      )}
    </article>
  );
}
