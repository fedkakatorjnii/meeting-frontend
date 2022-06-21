import { Button } from '@material-ui/core';
import { observer } from 'mobx-react';
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRootStore } from '../../common/hooks';

const USER = {
  username: 'admin',
  password: 'root',
};

export const Login = observer(() => {
  const { loginStore, usersStore } = useRootStore();

  const handleLogin = async () => {
    await loginStore.login(USER.username, USER.password);
    await usersStore.find(USER.username);
  };

  return (
    <div>
      <h2>go login</h2>
      {usersStore.user && <div>{usersStore.user?.username}</div>}
      <Button onClick={handleLogin}>login</Button>
      <Link to="/">На базу</Link>
    </div>
  );
});
