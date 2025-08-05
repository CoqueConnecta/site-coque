// src/pages/AdminPage.tsx
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

export default function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div>
      <h1>Painel de Administração</h1>
      <p>Em breve, o formulário de edição estará aqui.</p>
      <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px' }}>
        Sair
      </button>
    </div>
  );
}