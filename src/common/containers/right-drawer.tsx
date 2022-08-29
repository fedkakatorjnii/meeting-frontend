import React, { FC, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

import { Drawer as MuiDrawer } from '@ui';
import { useRootStore } from '@common/hooks';

interface RightDrawerProps {
  children: ReactNode;
}

const drawerWidth = 500;
// TODO нужен отступ сверху
const headerHeight = 64;

export const RightDrawer: FC<RightDrawerProps> = observer(({ children }) => {
  const { mainStore } = useRootStore();

  return (
    <MuiDrawer
      anchor="right"
      open={mainStore.isRightPanelOpen}
      onClose={mainStore.closeRightPanel}
      variant="persistent"
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
    >
      {children}
    </MuiDrawer>
  );
});

RightDrawer.displayName = 'RightDrawer';
