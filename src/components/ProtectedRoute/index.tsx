// src/components/ProtectedRoute/index.tsx
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase';

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // O hook useAuthState cuida de verificar o status do usuário em tempo real
  const [user, loading] = useAuthState(auth);

  if (loading) {
    // Mostra uma tela de carregamento enquanto verifica a autenticação
    return <div>Verificando autenticação...</div>;
  }

  if (!user) {
    // Se não houver usuário, redireciona para a página de login
    return <Navigate to="/login" />;
  }

  // Se houver um usuário, renderiza o componente filho (a página de admin)
  return <>{children}</>;
}