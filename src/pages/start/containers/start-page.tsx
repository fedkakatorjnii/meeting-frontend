import React from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Box, Button, Modal } from '@ui';
import { useRefresh } from '@common';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  outline: 'none',
};

export const StartPage = observer(() => {
  const navigate = useNavigate();

  const handleSignUp = () => navigate('/signup');
  const handleSignIn = () => navigate('/signin');

  useRefresh();

  return (
    <Modal open={true} hideBackdrop>
      <Box sx={style}>
        <Button
          style={{ marginTop: 16, marginBottom: 8 }}
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSignUp}
          size="large"
        >
          Sign Up
        </Button>
        <Button
          style={{ marginTop: 16, marginBottom: 8 }}
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSignIn}
          size="large"
        >
          Sign In
        </Button>
      </Box>
    </Modal>
  );
});

StartPage.displayName = 'StartPage';
