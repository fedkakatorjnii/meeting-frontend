import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { SxProps } from '@mui/system';
import NearMeIcon from '@mui/icons-material/NearMe';

import { LeftDrawer, MainBar, RightDrawer, useRootStore } from '@common';
import { Box, CssBaseline, Fab, useTheme, Zoom } from '@ui';
import { ProfileContainer } from '@features/profile';
import { MessagesContainer } from './messages-container';
import { MapComponent } from './map';

const fabStyle: SxProps = {
  position: 'absolute',
  bottom: 16,
  right: 16,
};

const SIZE_LEFT_RIGHT_PANEL = 499;

export const HomePage: FC = observer(() => {
  const { mainStore, currentGeolocationStore } = useRootStore();
  const theme = useTheme();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  useEffect(() => {
    currentGeolocationStore.init();
  }, []);

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
            onClick={() => {
              const left = mainStore.isLeftPanelOpen
                ? SIZE_LEFT_RIGHT_PANEL
                : undefined;
              const right = mainStore.isRightPanelOpen
                ? SIZE_LEFT_RIGHT_PANEL
                : undefined;

              currentGeolocationStore.goTo({ left, right });
            }}
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
