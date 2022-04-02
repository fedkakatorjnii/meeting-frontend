import React from 'react';
import {
  Container,
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Link,
} from '@material-ui/core';

export const Auth: React.FC = () => {
  const handleSubmit = () => {
    console.log('hueta');
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
          Рыгыстрация
        </Typography>
        <Box component="form" onSubmit={() => {}} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="Имя"
                variant="outlined"
                required
                fullWidth
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="secondName"
                label="Фамилия"
                variant="outlined"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="username"
                label="Логын"
                variant="outlined"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Мыло"
                variant="outlined"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Парол"
                variant="outlined"
                required
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
            onClick={handleSubmit}
          >
            Sign in
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
