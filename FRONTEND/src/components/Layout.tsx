import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-slate-800 hover:text-slate-600 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">C</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">Civic Tracker</span>
            </Link>

            <nav className="flex items-center space-x-1">
              {isLoggedIn ? (
                <>
                  <div className="hidden md:flex items-center text-sm text-slate-600 mr-6">
                    <div className="w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs font-medium text-slate-700">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span>Welcome, {user?.name}</span>
                  </div>

                  <Link
                    to="/report"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === "/report" 
                        ? "bg-slate-800 text-white shadow-sm" 
                        : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    Add Report
                  </Link>
                  
                  <Link
                    to="/my-reports"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === "/my-reports" 
                        ? "bg-slate-800 text-white shadow-sm" 
                        : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    My Reports
                  </Link>
                  
                 

                  <div className="ml-4 pl-4 border-l border-slate-200">
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="ml-2 px-6 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-all duration-200 shadow-sm"
                  >
                    Get Started
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 text-center text-xs text-slate-500 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <p>© 2025 Civic Tracker. Built with care for better communities.</p>
        </div>
      </footer>
    </div>
  );
}
