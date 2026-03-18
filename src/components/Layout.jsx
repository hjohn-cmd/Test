import { NavLink, useLocation } from 'react-router-dom';
import { Plane, Map, Home, Globe } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 text-blue-700 font-bold text-xl">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <Plane size={18} className="text-white" />
            </div>
            <span>Reiseplanlegger</span>
          </NavLink>

          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive && location.pathname === '/'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                }`
              }
            >
              <Home size={16} />
              <span className="hidden sm:inline">Hjem</span>
            </NavLink>
            <NavLink
              to="/trips"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                }`
              }
            >
              <Map size={16} />
              <span className="hidden sm:inline">Mine Reiser</span>
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-100 bg-white/60 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          <div className="flex items-center justify-center gap-2">
            <Globe size={14} />
            <span>Reiseplanlegger — Planlegg din neste eventyr</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
