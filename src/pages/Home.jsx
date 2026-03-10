import { useEffect, useState } from "react";
import api from "../services/api";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [hasMore, setHasMore] = useState(true);

  function extractPosts(resData) {
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData?.data)) return resData.data;
    if (Array.isArray(resData?.posts)) return resData.posts;
    if (Array.isArray(resData?.data?.posts)) return resData.data.posts;
    if (Array.isArray(resData?.data?.data)) return resData.data.data;
    return [];
  }

  function extractHasMore(resData, newPostsLength, limit) {
    const meta = resData?.meta || resData?.data?.meta;

    if (meta?.hasNextPage !== undefined) return Boolean(meta.hasNextPage);
    if (meta?.nextPage !== undefined) return Boolean(meta.nextPage);
    if (meta?.totalPages !== undefined && meta?.currentPage !== undefined) {
      return meta.currentPage < meta.totalPages;
    }

    return newPostsLength === limit;
  }

  async function fetchPosts({ pageToLoad = 1, append = false } = {}) {
    setLoading(true);
    setErrorMsg("");

    try {
      const limit = 10;
      const res = await api.get(`/posts/feed?only=all&page=${pageToLoad}&limit=${limit}`);
      const newPosts = extractPosts(res.data);

      setPosts((prev) => (append ? [...prev, ...newPosts] : newPosts));
      setHasMore(extractHasMore(res.data, newPosts.length, limit));
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to load posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts({ pageToLoad: 1, append: false });
  }, []);

  async function handleLoadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchPosts({ pageToLoad: nextPage, append: true });
  }

  function refreshPosts() {
    setPage(1);
    fetchPosts({ pageToLoad: 1, append: false });
  }

  return (
    <section className="page-wrap">
      <div className="container">
        <h2 className="page-title">Home Feed</h2>

        <CreatePost onCreated={refreshPosts} />

        {errorMsg ? <div className="alert alert-error">{errorMsg}</div> : null}
        {!loading && posts.length === 0 && !errorMsg ? <p className="empty-state">No posts yet.</p> : null}

        {posts.map((post) => (
          <PostCard key={post._id || post.id} post={post} onDeleted={refreshPosts} onUpdated={refreshPosts} />
        ))}

        {loading ? <p className="loading-text">Loading...</p> : null}

        {!loading && hasMore && posts.length > 0 ? (
          <div className="load-more-wrap">
            <button type="button" className="btn" onClick={handleLoadMore}>
              Load more
            </button>
          </div>
        ) : null}

        {!loading && !hasMore && posts.length > 0 ? <p className="empty-state">No more posts.</p> : null}
      </div>
    </section>
  );
}
