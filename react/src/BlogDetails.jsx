import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [commentBody, setCommentBody] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(res.data);
        
        // Fetch related posts
        const allPosts = await axios.get("http://localhost:5000/api/posts");
        const related = allPosts.data
          .filter(p => p._id !== id && p.category === res.data.category)
          .slice(0, 3);
        setRelatedPosts(related);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const submitComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to post a comment');
      return;
    }
    if (!commentBody.trim()) return;

    try {
      setSubmittingComment(true);
      const res = await axios.post(
        `http://localhost:5000/api/posts/${id}/comments`,
        { body: commentBody },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Append new comment to state
      setPost(prev => ({ ...prev, comments: [...(prev.comments || []), res.data.comment] }));
      setCommentBody('');
    } catch (err) {
      console.error('Error posting comment:', err);
      alert(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      technology: 'bg-blue-100 text-blue-700 border-blue-300',
      lifestyle: 'bg-purple-100 text-purple-700 border-purple-300',
      travel: 'bg-green-100 text-green-700 border-green-300',
      food: 'bg-orange-100 text-orange-700 border-orange-300',
      business: 'bg-gray-100 text-gray-700 border-gray-300',
    };
    return colors[category?.toLowerCase()] || 'bg-slate-100 text-slate-700 border-slate-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center animate-in fade-in zoom-in-95 duration-700">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Post Not Found</h2>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Button 
            onClick={() => navigate("/allblogs")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to All Blogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Back Button */}
        <div className="px-4 py-6 md:px-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-left duration-500">
          <Button
            onClick={() => navigate("/allblogs")}
            variant="outline"
            className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-xl font-semibold group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Blogs
          </Button>
        </div>

        {/* Main Content */}
        <article className="px-4 pb-12 md:px-8 max-w-5xl mx-auto">
          {/* Hero Image */}
          <div className="mb-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Category Badge on Image */}
              <div className="absolute top-6 left-6">
                <span className={`inline-flex items-center px-5 py-2 rounded-full text-sm font-bold border backdrop-blur-md ${getCategoryColor(post.category)} shadow-lg`}>
                  {post.category}
                </span>
              </div>
            </div>
          </div>

          {/* Article Header */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-10 mb-8 animate-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '100ms' }}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author Info */}
            <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">
                    {post.author?.name?.charAt(0)?.toUpperCase() || "A"}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {post.author?.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-500">Author</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">
                  {new Date(post.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">5 min read</span>
              </div>
            </div>

            {/* Article Content */}
            <div className="mt-8 prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {post.description}
              </p>
            </div>

            {/* Share Section */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-semibold">Share this post:</span>
                <div className="flex gap-3">
                  <button className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </button>
                  <button className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 p-6 md:p-8 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Comments</h3>
                <p className="text-sm text-gray-600">{(post?.comments || []).length} {(post?.comments || []).length === 1 ? 'comment' : 'comments'}</p>
              </div>
            </div>

            {/* New Comment Form */}
            <form onSubmit={submitComment} className="mb-8 group">
              <div className="relative">
                <textarea
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full p-4 pl-5 border-2 border-gray-200 rounded-2xl mb-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none resize-none bg-gray-50"
                  rows={4}
                  required
                />
                <div className="absolute bottom-6 left-5 text-xs text-gray-400">
                  {commentBody.length} characters
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Be respectful and constructive
                </p>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none" 
                  disabled={submittingComment}
                >
                  {submittingComment ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Posting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Post Comment
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </span>
                  )}
                </Button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {(post?.comments || []).length === 0 && (
                <div className="text-center py-12 animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">No comments yet</p>
                  <p className="text-gray-400 text-sm">Be the first to share your thoughts!</p>
                </div>
              )}

              {(post?.comments || []).map((c, idx) => (
                <div 
                  key={idx} 
                  className="p-5 border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 animate-in fade-in slide-in-from-left-4"
                  style={{ animationDelay: `${idx * 50}ms`, animationDuration: '500ms' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {c.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-bold text-gray-900">{c.name || 'Anonymous'}</p>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <p className="text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{c.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: '200ms' }}>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Related Posts</h2>
                <p className="text-gray-600">You might also like these articles</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost, index) => (
                  <div
                    key={relatedPost._id}
                    onClick={() => navigate(`/blog/${relatedPost._id}`)}
                    className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${300 + index * 100}ms` }}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(relatedPost.category)} mb-3`}>
                        {relatedPost.category}
                      </span>
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
