
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

export default function Dashboard({ user }) {
  const [posts, setPosts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title:"", description:"", imageUrl:"", category:"" });
  const [isDeleting, setIsDeleting] = useState(null);
  const [stats, setStats] = useState({ total: 0, categories: 0 });
  const token = localStorage.getItem("token");

  const fetchPosts = async () => {
    const res = await axios.get(`http://localhost:5000/api/posts/user/${user.id}`);
    setPosts(res.data);
    // Calculate stats
    const uniqueCategories = [...new Set(res.data.map(p => p.category))].length;
    setStats({ total: res.data.length, categories: uniqueCategories });
  };

  useEffect(() => { 
    fetchPosts(); 
  }, []);

  const handleDelete = async (id) => {
    setIsDeleting(id);
    setTimeout(async () => {
      await axios.delete(`http://localhost:5000/api/posts/${id}`, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
      setIsDeleting(null);
    }, 300);
  };

  const handleEdit = (post) => {
    setEditId(post._id);
    setForm(post);
    // Smooth scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api/posts/${editId}`, form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEditId(null);
    setForm({ title:"", description:"", imageUrl:"", category:"" });
    fetchPosts();
  };

  const getCategoryColor = (category) => {
    const colors = {
      technology: 'bg-blue-50 text-blue-700 border-blue-200',
      lifestyle: 'bg-purple-50 text-purple-700 border-purple-200',
      travel: 'bg-green-50 text-green-700 border-green-200',
      food: 'bg-orange-50 text-orange-700 border-orange-200',
      business: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return colors[category?.toLowerCase()] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 px-4 py-8 md:px-8 md:py-12 max-w-7xl mx-auto">
        {/* Header Section with Stats */}
        <div className="mb-12 animate-in fade-in slide-in-from-top-6 duration-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user?.name}</span>
              </h1>
              <p className="text-gray-600 text-lg">Manage your blog posts and content</p>
            </div>
            
            {/* Stats Cards */}
            <div className="flex gap-4">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 min-w-[120px] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-xs text-gray-500 font-medium">Total Posts</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 min-w-[120px] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{stats.categories}</p>
                    <p className="text-xs text-gray-500 font-medium">Categories</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form Modal-Style with Enhanced Animation */}
        {editId && (
          <div className="mb-10 animate-in slide-in-from-top-8 duration-500 zoom-in-95">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Edit Post</h3>
                      <p className="text-blue-100 text-sm">Update your blog post details</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditId(null);
                      setForm({ title:"", description:"", imageUrl:"", category:"" });
                    }}
                    className="text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              </div>
              
              {/* Form Content */}
              <form onSubmit={handleUpdate} className="p-6 space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2 animate-in slide-in-from-left duration-300" style={{ animationDelay: '100ms' }}>
                    <Label htmlFor="title" className="text-gray-700 font-semibold flex items-center gap-2">
                      <span className="text-blue-600">●</span> Title
                    </Label>
                    <Input 
                      id="title"
                      name="title" 
                      value={form.title} 
                      onChange={e => setForm({...form, title: e.target.value})} 
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter your post title"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 animate-in slide-in-from-right duration-300" style={{ animationDelay: '100ms' }}>
                    <Label htmlFor="category" className="text-gray-700 font-semibold flex items-center gap-2">
                      <span className="text-purple-600">●</span> Category
                    </Label>
                    <Input 
                      id="category"
                      name="category" 
                      value={form.category} 
                      onChange={e => setForm({...form, category: e.target.value})} 
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl transition-all duration-200 hover:border-gray-400"
                      placeholder="e.g., Technology, Lifestyle"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2 animate-in slide-in-from-left duration-300" style={{ animationDelay: '200ms' }}>
                  <Label htmlFor="description" className="text-gray-700 font-semibold flex items-center gap-2">
                    <span className="text-green-600">●</span> Description
                  </Label>
                  <textarea
                    id="description"
                    name="description" 
                    value={form.description} 
                    onChange={e => setForm({...form, description: e.target.value})} 
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 rounded-xl transition-all duration-200 hover:border-gray-400 resize-none"
                    placeholder="Write your post description..."
                    required
                  />
                </div>
                
                <div className="space-y-2 animate-in slide-in-from-right duration-300" style={{ animationDelay: '200ms' }}>
                  <Label htmlFor="imageUrl" className="text-gray-700 font-semibold flex items-center gap-2">
                    <span className="text-orange-600">●</span> Image URL
                  </Label>
                  <Input 
                    id="imageUrl"
                    name="imageUrl" 
                    value={form.imageUrl} 
                    onChange={e => setForm({...form, imageUrl: e.target.value})} 
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-xl transition-all duration-200 hover:border-gray-400"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4 animate-in fade-in duration-300" style={{ animationDelay: '300ms' }}>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Post
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditId(null);
                      setForm({ title:"", description:"", imageUrl:"", category:"" });
                    }}
                    className="px-8 border-2 border-gray-300 hover:bg-gray-100 rounded-xl py-6 text-base font-semibold transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Posts Grid with Modern Card Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((p, index) => (
            <div 
              key={p._id} 
              className={`group relative bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 ${
                isDeleting === p._id ? 'scale-95 opacity-0' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <img 
                  src={p.imageUrl} 
                  alt={p.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm ${getCategoryColor(p.category)} shadow-lg`}>
                    {p.category}
                  </span>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-6 space-y-4">
                <h3 className="font-bold text-xl text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-200">
                  {p.title}
                </h3>
                
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                  {p.description}
                </p>
                
                {/* Divider */}
                <div className="border-t border-gray-100"></div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleEdit(p)} 
                    variant="outline"
                    className="flex-1 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-xl py-5 font-semibold transition-all duration-200 group/btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transition-transform duration-200 group-hover/btn:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Button>
                  <Button 
                    onClick={() => handleDelete(p._id)} 
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl py-5 font-semibold shadow-md hover:shadow-lg transition-all duration-200 group/btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transition-transform duration-200 group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State with Animation */}
        {posts.length === 0 && (
          <div className="text-center py-24 animate-in fade-in zoom-in-95 duration-700">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-6 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">No posts yet</h3>
            <p className="text-gray-600 text-lg mb-8">Start creating amazing content for your blog</p>
            <Button 
              onClick={() => window.location.href = '/post'}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Post
            </Button>
          </div>
        )}
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




