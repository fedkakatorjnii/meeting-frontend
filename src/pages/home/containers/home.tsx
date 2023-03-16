import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { SxProps } from '@mui/system';
import NearMeIcon from '@mui/icons-material/NearMe';

import { LeftDrawer, MainBar, RightDrawer, useRootStore } from '@common';
import {
  Backdrop,
  Box,
  CircularProgress,
  CssBaseline,
  Fab,
  useTheme,
  Zoom,
} from '@ui';
import { ProfileContainer } from '@features/profile';
import { MessagesContainer } from './messages-container';
import { MapComponent } from './map';

const fabStyle: SxProps = {
  position: 'absolute',
  bottom: 16,
  right: 16,
};

export const HomePage: FC = observer(() => {
  const { authStore, currentGeolocationStore } = useRootStore();
  const theme = useTheme();
  const navigate = useNavigate();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

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
    currentGeolocationStore.init();
  }, []);

  if (authStore.error) return <>ERROR!</>;
  if (authStore.isLoading) {
    return (
      <Backdrop open={authStore.isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <MainBar position="static" />
      <MapComponent>
        <Zoom
          in={true}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${transitionDuration.exit}ms`,
          }}
          unmountOnExit
        >
          <Fab
            sx={fabStyle}
            aria-label="location"
            color="primary"
            disabled={!currentGeolocationStore.currentPosition.value}
            onClick={currentGeolocationStore.goTo}
          >
            <NearMeIcon />
          </Fab>
        </Zoom>
      </MapComponent>
      <LeftDrawer>
        <div style={{ height: 64 }}></div>
        <MessagesContainer />
      </LeftDrawer>
      <RightDrawer>
        <div style={{ height: 64 }}></div>
        <ProfileContainer />
      </RightDrawer>
    </Box>
  );
});

HomePage.displayName = 'HomePage';
