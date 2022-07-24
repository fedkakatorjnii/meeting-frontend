import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../../resources';
import { Container, Box, Grid, Typography, TextField, Button } from '../../ui';

type HTMLInputs = HTMLInputElement | HTMLTextAreaElement;

interface NewUser {
  firstName: string;
  secondName: string;
  username: string;
  email: string;
  password: string;
}

const FORM_INIT: NewUser = {
  firstName: '',
  secondName: '',
  username: '',
  email: '',
  password: '',
};

export const Signup: React.FC = () => {
  const [form, setForm] = useState<NewUser>(FORM_INIT);

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    await axiosInstance.post('/users', {
      ...form,
    });
  };

  const handleForm = (e: React.ChangeEvent<HTMLInputs>, fieldName: string) =>
    setForm({
      ...form,
      [fieldName]: e.target.value,
    });

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
        <Box component="form" onSubmit={(e) => handleSubmit(e)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                onChange={(e) => handleForm(e, 'username')}
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
                onChange={(e) => handleForm(e, 'email')}
                name="email"
                label="Email"
                variant="outlined"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={(e) => handleForm(e, 'password')}
                name="password"
                label="Пароль"
                variant="outlined"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={(e) => handleForm(e, 'firstName')}
                name="firstName"
                label="Имя"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={(e) => handleForm(e, 'secondName')}
                name="secondName"
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
            Sign in
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
};
