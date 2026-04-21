import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Placeholder */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
            {/* User can insert the image here */}
            {/* <img className="h-8 w-auto" src="placeholder.png" alt="Brand Logo" /> */}
            <div className="h-8 w-8 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500 font-semibold mr-2 border border-gray-300">
              Logo
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">LeaseChain</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <UserIcon size={16} />
                  <span className="font-medium">{user.username}</span>
                  <span className="text-gray-400 bg-white px-2 rounded font-mono text-[10px] uppercase border border-gray-200">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-900 transition text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-50"
                  title="Logout"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-md text-sm font-medium transition shadow-sm"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;