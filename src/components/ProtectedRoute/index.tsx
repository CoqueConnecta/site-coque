// src/components/ProtectedRoute/index.tsx
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, get } from 'firebase/database';
import { auth, database } from '../../../firebase';
import { signOut } from 'firebase/auth';

type ProtectedRouteProps = {
  children: ReactNode;
};

type AdminEntry = {
  email: string;
  isAdmin: boolean;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // O hook useAuthState cuida de verificar o status do usuário em tempo real
  const [user, authLoading] = useAuthState(auth);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setIsAuthorized(null);
      const checkAdminStatus = async () => {
        const adminsRef = ref(database, 'admins');
        try {
          const snapshot = await get(adminsRef);
          let isAdmin = false;
          if (snapshot.exists()) {
            // 2. Pegamos todos os admins da lista.
            const adminList: AdminEntry[] = snapshot.val();
            // 3. Verificamos se algum item na lista tem o email do usuário logado.
            isAdmin = adminList.some(admin => admin.email === user.email && admin.isAdmin === true);
          }
          setIsAuthorized(isAdmin);

        } catch (error) {
          console.error("Erro ao verificar permissão de admin:", error);
          setIsAuthorized(false);
        }
      };
      checkAdminStatus();
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // Se a autenticação do Firebase ainda está carregando, espere.
  if (authLoading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Verificando autenticação...</div>;
  }

  // Se não há usuário, redireciona para a página de login.
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Se o usuário está logado, mas a verificação de admin ainda está em andamento.
  if (isAuthorized === null) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Verificando permissões...</div>;
  }


  // Se o usuário está logado, mas NÃO está autorizado.
  if (isAuthorized === false) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'sans-serif',
        background: '#f4f4f4'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="Foto de perfil"
              style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '20px' }}
            />
          )}
          <h1 style={{ color: '#333' }}>Acesso Negado</h1>
          <p style={{ color: '#666', marginTop: '10px' }}>
            A conta <strong style={{ color: '#d9534f' }}>{user.email}</strong> não tem permissão para acessar esta página.
          </p>
          <button
            onClick={handleLogout}
            style={{
              marginTop: '30px',
              padding: '12px 25px',
              fontSize: '16px',
              color: 'white',
              background: '#007bff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Fazer login com outra conta
          </button>
        </div>
      </div>
    );
  }

  // Se houver um usuário, renderiza o componente filho (a página de admin)
  return <>{children}</>;
}
