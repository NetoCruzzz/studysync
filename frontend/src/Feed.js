import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const defaultPosts = [
  {
    id: 1,
    author: 'Alex',
    content: 'Finished my math review today. Feeling good!',
    comments: [
      { id: 11, author: 'Mia', text: 'Nice work!' },
      { id: 12, author: 'Jay', text: 'Keep it up!' }
    ],
    likes: 3,
    likedByMe: false
  },
  {
    id: 2,
    author: 'Sofia',
    content: 'Anyone want to join a study session for biology?',
    comments: [{ id: 21, author: 'Noah', text: 'Count me in!' }],
    likes: 1,
    likedByMe: false
  }
];

const STORAGE_KEY = 'studysync_feed_posts';

function Feed() {
  const [posts, setPosts] = useState(defaultPosts);
  const [newPost, setNewPost] = useState('');
  const [commentText, setCommentText] = useState({});
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPosts(JSON.parse(stored));
      setLoading(false);
      return;
    }

    const loadFeed = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/feed');
        const data = await res.json();
        if (res.ok) {
          const serverPosts = Array.isArray(data.posts)
            ? data.posts
            : Array.isArray(data)
            ? data
            : defaultPosts;
          setPosts(serverPosts);
        }
      } catch {
        setError('Unable to load feed from server; using local data.');
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const showStatus = (message) => {
    setStatus(message);
    setTimeout(() => setStatus(''), 1800);
  };

  const handleCreatePost = async () => {
    const trimmed = newPost.trim();
    if (!trimmed) return;

    const created = {
      id: Date.now(),
      author: 'You',
      content: trimmed,
      comments: [],
      likes: 0,
      likedByMe: false
    };

    setPosts((prev) => [created, ...prev]);
    setNewPost('');
    showStatus('Post created');

    try {
      await fetch('http://localhost:5000/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmed })
      });
    } catch {
      // frontend-only fallback
    }
  };

  const handleAddComment = async (postId) => {
    const text = (commentText[postId] || '').trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, { id: Date.now(), author: 'You', text }]
            }
          : post
      )
    );

    setCommentText((prev) => ({ ...prev, [postId]: '' }));
    showStatus('Comment added');

    try {
      await fetch(`http://localhost:5000/api/feed/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
    } catch {
      // frontend-only fallback
    }
  };

  const handleToggleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const likedByMe = !post.likedByMe;
        const likes = likedByMe ? post.likes + 1 : Math.max(post.likes - 1, 0);

        return { ...post, likedByMe, likes };
      })
    );
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
            placeholder="Share an update with your StudySync friends..."
            onChange={(e) => setNewPost(e.target.value)}
          />
          <button className="login-button" onClick={handleCreatePost}>
            Post
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="empty-state">No posts yet. Start the conversation!</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="feed-post">
              <div className="post-header">
                <strong>{post.author}</strong>
              </div>
              <p>{post.content}</p>

              <div className="post-actions" style={{ marginBottom: '14px' }}>
                <button
                  className="task-btn"
                  style={{ width: 'auto' }}
                  onClick={() => handleToggleLike(post.id)}
                >
                  {post.likedByMe ? 'Unlike' : 'Like'} ({post.likes})
                </button>
              </div>

              <div className="comments-section">
                <h4>Comments</h4>
                {post.comments.length === 0 ? (
                  <div className="empty-state">No comments yet.</div>
                ) : (
                  post.comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <strong>{comment.author}:</strong> {comment.text}
                    </div>
                  ))
                )}

                <div className="comment-input-row">
                  <input
                    className="login-input"
                    value={commentText[post.id] || ''}
                    placeholder="Write a comment..."
                    onChange={(e) =>
                      setCommentText((prev) => ({
                        ...prev,
                        [post.id]: e.target.value
                      }))
                    }
                  />
                  <button
                    className="login-button"
                    onClick={() => handleAddComment(post.id)}
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Feed;