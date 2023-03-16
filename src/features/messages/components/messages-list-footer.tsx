import React, { FC, useState } from 'react';
import { Paper, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { observer } from 'mobx-react-lite';

const FooterWrapper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  padding: '0.5rem',
  display: 'flex',
}));

interface MessagesListFooterProps {
  onSend: (message: string) => void;
}

export const MessagesListFooter: FC<MessagesListFooterProps> = observer(
  ({ onSend }) => {
    const [message, setMessage] = useState<string>('');

    const onKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'Enter') return;
      if (event.key !== 'Enter') return;
      if (event.shiftKey) return;

      event.preventDefault();

      if (event.ctrlKey || !message) return;

      onSend(message);
      setMessage('');
    };

    return (
      <FooterWrapper>
        <TextField
          label="Message"
          placeholder="Message"
          onChange={(e) => setMessage(e.target.value)}
          sx={{ width: '100%' }}
          rows={2}
          multiline
          value={message}
          onKeyPress={onKeyPress}
        />
      </FooterWrapper>
    );
  },
);
