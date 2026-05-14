import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { apiFetch } from './api';

const USER_KEY = 'studysync_user';

function Feed() {
  const navigate = useNavigate();
  const location = useLocation();
  const savedUser = JSON.parse(window.localStorage.getItem(USER_KEY) || 'null');
  const currentUser = location.state?.username || savedUser?.username || 'You';

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [commentText, setCommentText] = useState({});
  const [likes, setLikes] = useState({});
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const { response, data } = await apiFetch('/api/feed');
        if (response.ok && Array.isArray(data)) {
          setPosts(data);
        } else {
          setError('Unable to load feed.');
        }
      } catch {
        setError('Unable to load feed from server.');
      } finally {
        setLoading(false);
      }
    };
    loadFeed();
  }, []);

  const showStatus = (message) => {
    setStatus(message);
    setTimeout(() => setStatus(''), 1800);
  };

  const handleCreatePost = async () => {
    const content = newPost.trim();
    if (!content) return;

    const { response, data } = await apiFetch('/api/feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: currentUser, content })
    });
    if (response.ok) {
      setPosts((prev) => [data, ...prev]);
      setNewPost('');
      showStatus('Post created');
    } else {
      setError(data?.error || 'Failed to create post.');
    }
  };

  const handleAddComment = async (postId) => {
    const text = (commentText[postId] || '').trim();
    if (!text) return;

    const { response, data } = await apiFetch(`/api/feed/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: currentUser, text })
    });
    if (response.ok) {
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, comments: [...(post.comments || []), data] }
            : post
        )
      );
      setCommentText((prev) => ({ ...prev, [postId]: '' }));
      showStatus('Comment added');
    } else {
      setError(data?.error || 'Failed to add comment.');
    }
  };

  const handleToggleLike = (postId) => {
    setLikes((prev) => {
      const current = prev[postId] || { count: 0, mine: false };
      const mine = !current.mine;
      const count = mine ? current.count + 1 : Math.max(current.count - 1, 0);
      return { ...prev, [postId]: { count, mine } };
    });
  };

  return (
    <div className="feed-container">
      <div className="feed-card">
        <div className="feed-header">
          <button className="nav-button" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
          <h1>Social Feed</h1>
        </div>

        {loading && <div className="message info">Loading feed…</div>}
        {error && <div className="message error">{error}</div>}
        {status && <div className="message success">{status}</div>}

        <div className="new-post-section">
          <textarea
            className="login-input"
            rows="4"
            value={newPost}
            placeholder={`Share an update, ${currentUser}...`}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <button className="login-button" onClick={handleCreatePost}>
            Post
          </button>
        </div>

        {!loading && posts.length === 0 ? (
          <div className="empty-state">No posts yet. Start the conversation!</div>
        ) : (
          posts.map((post) => {
            const like = likes[post._id] || { count: 0, mine: false };
            return (
              <div key={post._id} className="feed-post">
                <div className="post-header">
                  <strong>{post.author}</strong>
                  {post.createdAt && (
                    <span>{new Date(post.createdAt).toLocaleString()}</span>
                  )}
                </div>
                <p>{post.content}</p>

                <div className="post-actions">
                  <button className="task-btn" onClick={() => handleToggleLike(post._id)}>
                    {like.mine ? 'Unlike' : 'Like'} ({like.count})
                  </button>
                </div>

                <div className="comments-section">
                  <h4>Comments</h4>
                  {(!post.comments || post.comments.length === 0) ? (
                    <div className="empty-state">No comments yet.</div>
                  ) : (
                    post.comments.map((comment, idx) => (
                      <div key={comment._id || idx} className="comment-item">
                        <strong>{comment.author}:</strong> {comment.text}
                      </div>
                    ))
                  )}

                  <div className="comment-input-row">
                    <input
                      className="login-input"
                      value={commentText[post._id] || ''}
                      placeholder="Write a comment..."
                      onChange={(e) =>
                        setCommentText((prev) => ({
                          ...prev,
                          [post._id]: e.target.value
                        }))
                      }
                    />
                    <button className="login-button" onClick={() => handleAddComment(post._id)}>
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Feed;
