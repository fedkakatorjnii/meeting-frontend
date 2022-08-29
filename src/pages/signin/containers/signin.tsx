import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Box, Button, Container, Grid, TextField, Typography } from '@ui';
import { LoginRequest, PartialLoginRequest } from '@API';
import { useRefresh, useRootStore } from '@common';

const isLoginRequest = (
  values: PartialLoginRequest,
): values is LoginRequest => {
  const { password, username } = values;
  if (!password || !username) return false;

  return true;
};

export const SignIn = observer(() => {
  const { authStore } = useRootStore();
  const { isLoading } = authStore;
  const navigate = useNavigate();

  useRefresh();

  const [form, setForm] = useState<PartialLoginRequest>({});

  const handleForm = <
    T extends PartialLoginRequest[K],
    K extends keyof PartialLoginRequest,
  >(
    value: T,
    fieldName: K,
  ) =>
    setForm((form) => ({
      ...form,
      [fieldName]: value,
    }));

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (!isLoginRequest(form)) return;

    await authStore.login(form);
    navigate('/');
  };

  return (
    <Container maxWidth="xs" component="main">
      <Box
        sx={{
          marginTop: 32,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Войти в аккаунт
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                onChange={(e) => handleForm(e.target.value, 'username')}
                name="username"
                label="Логин"
                variant="outlined"
                required
                fullWidth
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={(e) => handleForm(e.target.value, 'password')}
                type="password"
                name="password"
                label="Пароль"
                variant="outlined"
                required
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            disabled={isLoading}
            style={{ marginTop: 16, marginBottom: 8 }}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
          >
            Войти
          </Button>
        </Box>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link to="/signup">У вас ещё нет аккаунта? Регистрация</Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
});

SignIn.displayName = 'SignIn';
