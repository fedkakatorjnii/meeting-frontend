import React, { FC } from 'react';
import {
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  Badge,
  Box,
  IconButton,
  styled,
  Toolbar,
  Typography,
} from '@ui';
import {
  AccountCircleIcon,
  MailIcon,
  MenuIcon,
  NotificationsIcon,
} from '@ui/icons';
import { MainBarMenu } from './main-bar-menu';
import { useRootStore } from '@common/hooks';
import { observer } from 'mobx-react-lite';

interface MainBarProps extends AppBarProps {
  //
}

const MainTitle = 'MEETING';
const menuId = 'primary-search-account-menu';
const mobileMenuId = 'primary-search-account-menu-mobile';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const MainBar: FC<MainBarProps> = observer(() => {
  const { mainStore, roomsStore } = useRootStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = !!anchorEl;

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const newMessagesCount = roomsStore.rooms?.reduce(
    (acc, current) => acc + current.messages.news.length,
    0,
  );
  // TODO сделать отдельный счётчик
  const newNotificationCount = newMessagesCount;

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 2 }}
          onClick={mainStore.toggleLeftPanel}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { sm: 'block' } }}
        >
          {MainTitle}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { md: 'flex' } }}>
          <IconButton
            size="large"
            aria-label={`show ${newMessagesCount} new mails`}
            color="inherit"
          >
            <Badge badgeContent={newMessagesCount} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            aria-label={`show ${newNotificationCount} new notifications`}
            color="inherit"
          >
            <Badge badgeContent={newNotificationCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
      <MainBarMenu
        id={menuId}
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
      />
    </AppBar>
  );
});

MainBar.displayName = 'MainBar';
