import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Container, Box, Grid, Typography, TextField, Button } from '@ui';
import { NewUserRequest, PartialNewUserRequest } from '@API';
import { useRootStore } from '@common';

const isNewUserRequest = (
  values: PartialNewUserRequest,
): values is NewUserRequest => {
  const { email, password, username } = values;
  if (!email || !password || !username) return false;

  return true;
};

export const SignUp = observer(() => {
  const { userStore } = useRootStore();
  const [form, setForm] = useState<PartialNewUserRequest>({});
  const navigate = useNavigate();

  const handleForm = <
    T extends PartialNewUserRequest[K],
    K extends keyof PartialNewUserRequest,
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
    if (!isNewUserRequest(form)) return;

    await userStore.create(form);
    navigate('..');
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
          Регистрация
        </Typography>
        <Box
          component="form"
          // onSubmit={(e) => handleSubmit(e)}
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
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
                onChange={(e) => handleForm(e.target.value, 'email')}
                name="email"
                label="Email"
                variant="outlined"
                required
                fullWidth
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
            <Grid item xs={12}>
              <TextField
                onChange={(e) => handleForm(e.target.value, 'firstName')}
                name="firstName"
                label="Имя"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={(e) => handleForm(e.target.value, 'lastName')}
                name="lastName"
                label="Фамилия"
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            style={{ marginTop: 16, marginBottom: 8 }}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
          >
            Зарегистрироваться
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login">Уже есть аккаунт? Войдите</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
});

SignUp.displayName = 'SignUp';
