import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import CommentItem from "../components/CommentItem";
import CreateComment from "../components/CreateComment";
import { AuthContext } from "../context/AuthContext";

export default function PostDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  function extractPost(resData) {
    if (!resData) return null;
    if (resData?.data?.post) return resData.data.post;
    if (resData?.data && !Array.isArray(resData.data)) return resData.data;
    if (resData?.post) return resData.post;
    return resData;
  }

  function extractComments(resData) {
    if (!resData) return [];
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData?.data)) return resData.data;
    if (Array.isArray(resData?.comments)) return resData.comments;
    if (Array.isArray(resData?.data?.comments)) return resData.data.comments;
    if (Array.isArray(resData?.data?.data)) return resData.data.data;
    return [];
  }

  async function fetchPost() {
    setLoadingPost(true);
    setErrorMsg("");

    try {
      const res = await api.get(`/posts/${id}`);
      setPost(extractPost(res.data));
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to load post");
    } finally {
      setLoadingPost(false);
    }
  }

  async function fetchComments() {
    setLoadingComments(true);

    try {
      const res = await api.get(`/posts/${id}/comments?page=1&limit=50`);
      setComments(extractComments(res.data));
    } catch {
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  }

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  async function handleDeleteComment(commentId) {
    const confirmed = window.confirm("Delete comment?");
    if (!confirmed) return;

    try {
      await api.delete(`/comments/${commentId}`);
      await fetchComments();
      alert("Comment deleted ✅");
    } catch (err) {
      alert(err?.response?.data?.message || "Delete not allowed");
    }
  }

  async function handleUpdateComment(commentId, content) {
    try {
      await api.put(`/comments/${commentId}`, { content });
      await fetchComments();
      alert("Comment updated ✅");
    } catch (err) {
      alert(err?.response?.data?.message || "Update not allowed");
    }
  }

  const postUserName = post?.user?.name || post?.postCreator?.name || post?.createdBy?.name || "User";
  const postText = post?.body || post?.content || post?.text || post?.caption || "";
  const postImage = post?.image || post?.postImage || post?.img || post?.photo || "";

  return (
    <section className="page-wrap">
      <div className="container details-container">
        <Link to="/home" className="back-link">
          ← Back
        </Link>

        <h2 className="page-title">Post Details</h2>

        {errorMsg ? <div className="alert alert-error">{errorMsg}</div> : null}
        {loadingPost ? <p className="loading-text">Loading post...</p> : null}

        {post && !loadingPost ? (
          <article className="card post-card">
            <h4 className="post-user">{postUserName}</h4>
            {postText ? <p className="post-body">{postText}</p> : null}
            {postImage ? <img src={postImage} alt="post" className="post-image" /> : null}
          </article>
        ) : null}

        <div className="section-divider" />

        <h3 className="section-title">Comments</h3>
        <CreateComment postId={id} onCreated={fetchComments} />

        {loadingComments ? <p className="loading-text">Loading comments...</p> : null}
        {!loadingComments && comments.length === 0 ? <p className="empty-state">No comments yet.</p> : null}

        {comments.map((comment) => {
          const commentUserId =
            comment?.user?._id ||
            comment?.commentCreator?._id ||
            comment?.createdBy?._id ||
            comment?.user?.id ||
            comment?.commentCreator?.id ||
            comment?.createdBy?.id;

          const myId = user?._id || user?.id;
          const canEdit = String(myId) === String(commentUserId);

          return (
            <CommentItem
              key={comment._id || comment.id}
              comment={comment}
              canEdit={canEdit}
              onDelete={handleDeleteComment}
              onUpdate={handleUpdateComment}
            />
          );
        })}
      </div>
    </section>
  );
}
