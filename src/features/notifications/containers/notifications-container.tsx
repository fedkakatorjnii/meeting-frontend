import React from 'react';
import { observer } from 'mobx-react-lite';

import { useRootStore } from '@common';
import { NotaficationsItem } from '../components/notafications-item';

export const NotificationsContainer: React.FC = observer(() => {
  const { notificationsStore } = useRootStore();

  const [first] = notificationsStore.list;

  return (
    <NotaficationsItem item={first} onClose={() => notificationsStore.pop()} />
  );
});
NotificationsContainer.displayName = 'NotificationsContainer';
