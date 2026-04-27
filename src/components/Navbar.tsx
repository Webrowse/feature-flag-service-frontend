import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="border-b border-stone-200 bg-white px-8 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-6 h-6 rounded bg-stone-800 flex items-center justify-center">
            <span className="text-white text-xs font-bold">F</span>
          </div>
          <span className="font-semibold text-stone-800 tracking-tight text-sm">Feature Flag Service</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-stone-500 hover:text-stone-800 hover:bg-stone-100"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
