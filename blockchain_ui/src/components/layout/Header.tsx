import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { account } = useWallet();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="py-4 px-6 md:px-12 bg-[#2B2B2B] flex items-center justify-between text-white border-b border-gray-700">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold font-mono">
        <span className="text-purple-500">NFT</span> Marketplace
      </Link>

      <nav className="hidden md:flex gap-8 items-center font-medium">
        <Link to="/marketplace" className="hover:text-purple-400 transition">Marketplace</Link>
        <Link to="/rankings" className="hover:text-purple-400 transition">Rankings</Link>
        {/* <Link to="/artist" className="hover:text-purple-400 transition">Artists</Link> */}

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link to="/user/profile" className="flex items-center gap-2 hover:text-purple-400">
              {user?.avatar ? (<img src={user.avatar} className="w-8 h-8 rounded-full" alt="avatar" />) : (<span className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-sm">{user?.username ? user.username[0] : 'U'}</span>)}
              <span>{user?.username || 'User'}</span>
            </Link>
            <button onClick={() => { logout(); navigate('/login'); }} className="text-sm bg-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-500/30">Logout</button>
          </div>
        ) : (
          <Link to="/login" className="bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-700 transition">Login</Link>
        )}

        {account && (
          <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-mono">
            {account.slice(0, 6)}...{account.slice(-4)}
          </div>
        )}
      </nav>

      {/* Mobile Toggle */}
      <button
        className="md:hidden text-white text-2xl"
        onClick={() => setOpen(!open)}
      >
        <FontAwesomeIcon icon={open ? faXmark : faBars} />
      </button>

      {/* Mobile Menu (Simplified) */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-[#3B3B3B] px-6 py-6 space-y-4 text-white z-50 shadow-lg">
          <Link to="/marketplace" className="block w-full py-2 hover:bg-gray-700 rounded pl-2">Marketplace</Link>
          <Link to="/rankings" className="block w-full py-2 hover:bg-gray-700 rounded pl-2">Rankings</Link>
          {isAuthenticated ? (
            <>
              <Link to="/user/profile" className="block w-full py-2 hover:bg-gray-700 rounded pl-2">Profile</Link>
              <button onClick={() => { logout(); navigate('/login'); }} className="block w-full text-left py-2 text-red-400 hover:bg-gray-700 rounded pl-2">Logout</button>
            </>
          ) : (
            <Link to="/login" className="block w-full py-2 bg-purple-600 rounded text-center">Login</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
