import { useEffect, useMemo, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const myId = user?._id || user?.id;

  function extractPosts(resData) {
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData?.data)) return resData.data;
    if (Array.isArray(resData?.posts)) return resData.posts;
    if (Array.isArray(resData?.data?.posts)) return resData.data.posts;
    if (Array.isArray(resData?.data?.data)) return resData.data.data;
    return [];
  }

  async function fetchMyPosts() {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.get("/posts/feed?only=all&page=1&limit=50");
      const allPosts = extractPosts(res.data);

      const filtered = allPosts.filter((post) => {
        const postUserId =
          post?.user?._id ||
          post?.postCreator?._id ||
          post?.createdBy?._id ||
          post?.user?.id ||
          post?.postCreator?.id ||
          post?.createdBy?.id;

        return String(postUserId) === String(myId);
      });

      setMyPosts(filtered);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to load profile posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (myId) {
      fetchMyPosts();
    }
  }, [myId]);

  const displayName = useMemo(() => {
    const firstPostOwner = myPosts[0]?.user?.name || myPosts[0]?.postCreator?.name || myPosts[0]?.createdBy?.name;
    return firstPostOwner || "My Profile";
  }, [myPosts]);

  function refreshPosts() {
    fetchMyPosts();
  }

  return (
    <section className="page-wrap">
      <div className="container profile-page">
        <div className="card profile-card">
          <div className="profile-header">
            <img src="https://i.pravatar.cc/160?img=3" alt="profile" className="profile-img" />

            <div className="profile-content">
              <h2 className="page-title">{displayName}</h2>
              <p className="profile-meta">User ID: {myId}</p>
              <p className="profile-meta">Posts: {myPosts.length}</p>
            </div>
          </div>

          <button type="button" className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>

        <h3 className="section-title">My Posts</h3>

        {loading ? <p className="loading-text">Loading...</p> : null}
        {errorMsg ? <div className="alert alert-error">{errorMsg}</div> : null}
        {!loading && myPosts.length === 0 ? <p className="empty-state">You have no posts yet.</p> : null}

        {myPosts.map((post) => (
          <PostCard key={post._id || post.id} post={post} onDeleted={refreshPosts} onUpdated={refreshPosts} />
        ))}
      </div>
    </section>
  );
}
