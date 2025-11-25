import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, LoginCredentials } from '../types';
import { signIn as signInService, signOut as signOutService, getCurrentUser } from '../services/supabase';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Debug: Monitorar mudanças no user state
  useEffect(() => {
    console.log('👤 User state mudou:', user ? `${user.nomeCompleto} (${user.role})` : 'null (deslogado)');
    console.log('🔐 isAuthenticated seria:', !!user);
  }, [user]);

  // Verificar se há sessão ativa ao carregar
  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      if (!isMounted) return;
      await checkSession();
    };
    
    init();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
          const currentUser = await getCurrentUser();
          if (isMounted) setUser(currentUser);
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) setUser(null);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          const currentUser = await getCurrentUser();
          if (isMounted) setUser(currentUser);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      console.log('🔍 Verificando sessão...');
      
      // Adicionar timeout de 5 segundos
      const timeoutPromise = new Promise<User | null>((resolve) => {
        setTimeout(() => {
          console.log('⏱️ Timeout ao verificar sessão');
          resolve(null);
        }, 5000);
      });
      
      const userPromise = getCurrentUser();
      
      const currentUser = await Promise.race([userPromise, timeoutPromise]);
      
      console.log('✅ Sessão verificada:', currentUser ? `${currentUser.nomeCompleto}` : 'Nenhum usuário logado');
      setUser(currentUser);
    } catch (error) {
      console.error('❌ Erro ao verificar sessão:', error);
      setUser(null);
    } finally {
      console.log('✅ Loading finalizado');
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signInService(credentials);
      
      if (result.error) {
        return { success: false, error: result.error };
      }

      setUser(result.user);
      return { success: true };
    } catch (error: any) {
      console.error('Erro no login:', error);
      return { success: false, error: error.message || 'Erro ao fazer login' };
    }
  };

  const logout = async () => {
    try {
      console.log('🔴 Iniciando logout...');
      await signOutService();
      console.log('🔴 signOutService executado');
      setUser(null);
      console.log('🔴 User state limpo (null)');
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}