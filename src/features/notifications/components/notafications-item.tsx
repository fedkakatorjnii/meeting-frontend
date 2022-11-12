import React from 'react';
import { Alert, Snackbar } from '@mui/material';

import { Notification } from 'store/notifications-store';

interface NotaficationsItemProps {
  item?: Notification;
  onClose: () => void;
}

const autoHideDuration = 3000;
const resumeHideDuration = 1000;

export const NotaficationsItem: React.FC<NotaficationsItemProps> = ({
  item,
  onClose,
}) => {
  const open = !!item?.msg;

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
      resumeHideDuration={resumeHideDuration}
    >
      <Alert severity={item?.severity} onClose={onClose}>
        {item?.msg}
      </Alert>
    </Snackbar>
  );
};

NotaficationsItem.displayName = 'NotaficationsItem';
