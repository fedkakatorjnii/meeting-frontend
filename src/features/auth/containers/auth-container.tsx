import React, { FC, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useRootStore } from '@common';
import { Backdrop, CircularProgress } from '@ui';

interface AuthContainerProps {
  children?: ReactNode;
}

export const AuthContainer: FC<AuthContainerProps> = observer(
  ({ children }) => {
    const { authStore } = useRootStore();
    const navigate = useNavigate();

    const handleRefresh = async () => {
      try {
        await authStore.refresh();

        if (!authStore.isAuth) navigate('/start');
      } catch (error) {
        navigate('/start');
      }
    };

    useEffect(() => {
      handleRefresh();
    }, []);

    if (authStore.error) return <>ERROR!</>;
    if (authStore.isLoading) {
      return (
        <Backdrop open={authStore.isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    }

    return <>{children}</>;
  },
);
AuthContainer.displayName = 'AuthContainer';
