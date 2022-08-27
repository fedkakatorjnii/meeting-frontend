import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRootStore } from './use-root-store';

export const useRefresh = () => {
  const { authStore } = useRootStore();
  const navigate = useNavigate();

  const refresh = async () => {
    try {
      await authStore.refresh();
      if (authStore.isAuth) navigate('/');
    } catch (error) {
      // TODO
    }
  };

  useEffect(() => {
    if (authStore.isAuth) {
      navigate('/');
    } else {
      refresh();
    }
  }, []);

  return null;
};
