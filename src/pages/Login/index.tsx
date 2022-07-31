import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { LoginForm } from '../../API/resources/Auth';
import { StoreContext } from '../../context/StoreContextProvider';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  HTMLInput,
} from '@ui';

export const Login: React.FC = observer(() => {
  const { authStore } = useContext(StoreContext);
  const { isLoading } = authStore;
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({
    username: '',
    password: '',
  });

  const handleForm = (
    e: React.ChangeEvent<HTMLInput>,
    field: keyof LoginForm,
  ) =>
    setForm({
      ...form,
      [field]: e.target.value,
    });

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    await authStore.login(form).then(() => {
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
          Войти в аккаунт
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
                onChange={(e) => handleForm(e, 'password')}
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
      </Box>
    </Container>
  );
});
