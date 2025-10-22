
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./components/ui/sheet";

export default function Header({ user, setUser }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-white/95 animate-in slide-in-from-top duration-500">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 md:px-6">
        {/* Logo / Title with animation */}
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-600 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
          </div>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent transition-all duration-300">
            Personal Blog
          </h1>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          <Link 
            to="/dashboard" 
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all duration-200 relative group"
          >
            <span className="relative">
              Dashboard
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </span>
          </Link>
          <Link 
            to="/allblogs" 
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all duration-200 relative group"
          >
            <span className="relative">
              All Blogs
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </span>
          </Link>
          <Link 
            to="/post" 
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all duration-200 relative group"
          >
            <span className="relative">
              Post
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </span>
          </Link>

          <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-200">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="w-7 h-7 bg-gradient-to-br from-slate-700 to-slate-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-slate-900">{user?.name}</span>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-slate-300 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Button>
          </div>
        </nav>

        {/* Mobile Menu using Sheet */}
        <div className="md:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-slate-100 transition-all duration-200"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-6 w-6 text-slate-700 transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-white border-slate-200">
              <SheetHeader className="border-b border-slate-200 pb-4 mb-4">
                <SheetTitle className="text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500">Personal Account</p>
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col space-y-1">
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-all duration-200 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="font-medium">Dashboard</span>
                </Link>
                
                <Link
                  to="/allblogs"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-all duration-200 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="font-medium">All Blogs</span>
                </Link>
                
                <Link
                  to="/post"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-all duration-200 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-medium">Create Post</span>
                </Link>
              </nav>

              <div className="absolute bottom-6 left-4 right-4">
                <Button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}




