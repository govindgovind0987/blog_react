
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";

export default function AllBlogs() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchPosts(); 
  }, []);

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

  const categories = ["all", ...new Set(posts.map(p => p.category?.toLowerCase()).filter(Boolean))];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category?.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewDetails = (postId) => {
    navigate(`/blog/${postId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 px-4 py-8 md:px-8 md:py-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-6 duration-700">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Discover <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Amazing Stories</span>
          </h1>
          <p className="text-gray-600 text-lg">Explore our collection of insightful articles and blog posts</p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500" style={{ animationDelay: '100ms' }}>
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search blogs by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400 shadow-sm hover:shadow-md"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 capitalize border-2 animate-in fade-in zoom-in-95 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50 shadow-sm hover:shadow-md'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 animate-in fade-in duration-300" style={{ animationDelay: '200ms' }}>
          <p className="text-gray-600 font-medium">
            Showing <span className="text-blue-600 font-bold">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        )}

        {/* Blog Posts Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredPosts.map((post, index) => (
              <div 
                key={post._id} 
                className="group relative bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleViewDetails(post._id)}
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm ${getCategoryColor(post.category)} shadow-lg`}>
                      {post.category}
                    </span>
                  </div>

                  {/* Hover Overlay with "Read More" */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <span className="text-gray-900 font-bold flex items-center gap-2">
                        Read More
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-xl text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-200">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {post.description}
                  </p>
                  
                  {/* Author Info */}
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {post.author?.name?.charAt(0)?.toUpperCase() || "A"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {post.author?.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-500">Author</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-24 animate-in fade-in zoom-in-95 duration-700">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">No posts found</h3>
            <p className="text-gray-600 text-lg mb-8">Try adjusting your search or filter criteria</p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              Clear Filters
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


