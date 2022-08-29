import React, { FC } from 'react';

import { ListItemIcon, ListItemText, Menu, MenuItem, MenuProps } from '@ui';
import { useRootStore } from '@common/hooks';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { LogoutIcon, PersonIcon } from '@ui/icons';

interface MainBarMenuProps extends MenuProps {
  //
}

export const MainBarMenu: FC<MainBarMenuProps> = observer(
  ({ anchorEl, id, open, onClose }) => {
    const { mainStore, authStore } = useRootStore();
    const navigate = useNavigate();

    const handleLogOut = () => {
      authStore.logout();
      navigate('/start');
    };

    return (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={id}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={onClose}
      >
        <MenuItem onClick={mainStore.toggleRightPanel}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logoout</ListItemText>
        </MenuItem>
      </Menu>
    );
  },
);

MainBarMenu.displayName = 'MainBarMenu';
