// src/pages/LoginPage.tsx
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Após o login bem-sucedido, o usuário será redirecionado
      // pela lógica do ProtectedRoute, mas podemos forçar aqui também.
      navigate('/admin');
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '18px' }}>
        Entrar com Google
      </button>
    </div>
  );
}
