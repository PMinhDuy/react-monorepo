import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useLazyQuery } from '@apollo/client/react';
import {
  LoginDocument,
  RegisterDocument,
  MeDocument,
  apolloClient,
} from '@react-monorepo/shared-graphql';
import { useAuthStore, UserRole } from './auth-store';

export function useAuth() {
  const navigate = useNavigate();
  const {
    accessToken,
    user,
    isInitialized,
    setAuth,
    setUser,
    setInitialized,
    clearAuth,
  } = useAuthStore();

  const [loginMutation, { loading: loginLoading, error: loginError }] =
    useMutation(LoginDocument);
  const [registerMutation, { loading: registerLoading, error: registerError }] =
    useMutation(RegisterDocument);
  const [fetchMe] = useLazyQuery(MeDocument, { fetchPolicy: 'network-only' });

  const logout = useCallback(() => {
    clearAuth();
    apolloClient.clearStore().catch(() => {
      // Ignore cache clear errors
    });
    navigate('/login', { replace: true });
  }, [clearAuth, navigate]);

  useEffect(() => {
    if (accessToken && !isInitialized) {
      fetchMe()
        .then(({ data }) => {
          if (data?.me) {
            setUser(data.me);
          } else {
            logout();
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setInitialized(true);
        });
    } else if (!accessToken && !isInitialized) {
      setInitialized(true);
    }
  }, [accessToken, isInitialized, fetchMe, setUser, setInitialized, logout]);

  const login = async (email: string, password: string) => {
    const { data } = await loginMutation({ variables: { email, password } });
    if (data?.login) {
      setAuth(data.login.accessToken, data.login.refreshToken, data.login.user);
      return data.login.user;
    }
    throw new Error('Login failed');
  };

  const register = async (input: {
    name: string;
    email: string;
    password: string;
  }) => {
    const { data } = await registerMutation({ variables: input });
    if (data?.register) {
      setAuth(
        data.register.accessToken,
        data.register.refreshToken,
        data.register.user
      );
      return data.register.user;
    }
    throw new Error('Registration failed');
  };

  const hasRole = (allowedRoles: UserRole[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return {
    user,
    role: user?.role,
    isAuthenticated: !!accessToken && !!user,
    isInitialized,
    login,
    loginLoading,
    loginError,
    register,
    registerLoading,
    registerError,
    logout,
    hasRole,
  };
}
