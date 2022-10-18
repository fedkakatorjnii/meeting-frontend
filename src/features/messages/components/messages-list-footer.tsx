import React, { FC, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { IconButton, Paper, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterWrapper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  padding: '0.5rem',
  display: 'flex',
}));

interface MessagesListFooterProps {
  onSend: (message?: string) => void;
}

export const MessagesListFooter: FC<MessagesListFooterProps> = ({ onSend }) => {
  const [message, setMessage] = useState<string>();
  return (
    <FooterWrapper>
      <TextField
        label="Message"
        placeholder="Message"
        onChange={(e) => setMessage(e.target.value)}
        sx={{ width: '100%' }}
        rows={2}
        multiline
      />
      <IconButton aria-label="back" onClick={() => onSend(message)}>
        <SendIcon />
      </IconButton>
    </FooterWrapper>
  );
};
