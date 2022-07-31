import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  Container,
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  HTMLInput,
} from '@ui';
import { NewUser } from '../../API/resources/Auth';
import { StoreContext } from '../../context/StoreContextProvider';

const FORM_INIT: NewUser = {
  firstName: '',
  secondName: '',
  username: '',
  email: '',
  password: '',
};

export const Signup: React.FC = observer(() => {
  const { authStore } = useContext(StoreContext);
  const { isLoading, error } = authStore;
  const [form, setForm] = useState<NewUser>(FORM_INIT);
  const navigate = useNavigate();

  const handleForm = (
    e: React.ChangeEvent<HTMLInput>,
    fieldName: keyof NewUser,
  ) =>
    setForm({
      ...form,
      [fieldName]: e.target.value,
    });

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    await authStore.registration(form).then(() => {
      navigate('/');
    });
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
            disabled={isLoading}
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
