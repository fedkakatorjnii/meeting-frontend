import React, { FC, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

import { Drawer as MuiDrawer } from '@ui';
import { useRootStore } from '@common/hooks';

interface LeftDrawerProps {
  children: ReactNode;
}

const drawerWidth = 500;
// TODO нужен отступ сверху
const headerHeight = 64;

export const LeftDrawer: FC<LeftDrawerProps> = observer(({ children }) => {
  const { mainStore } = useRootStore();

  return (
    <MuiDrawer
      anchor="left"
      open={mainStore.isLeftPanelOpen}
      onClose={mainStore.closeLeftPanel}
      variant="persistent"
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { sm: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
    >
      {children}
    </MuiDrawer>
  );
});

LeftDrawer.displayName = 'LeftDrawer';
