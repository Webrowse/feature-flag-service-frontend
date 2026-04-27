import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav>
      <span onClick={() => navigate('/')} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
        Feature Flags
      </span>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
