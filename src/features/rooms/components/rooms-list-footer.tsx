import React, { FC } from 'react';
import { Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterWrapper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  padding: '0.5rem',
  display: 'flex',
}));

interface RoomsListFooterProps {
  onCreate: () => void;
}

export const RoomsListFooter: FC<RoomsListFooterProps> = ({ onCreate }) => {
  return (
    <FooterWrapper>
      <Button variant="contained" color="primary" onClick={onCreate}>
        create
      </Button>
    </FooterWrapper>
  );
};

RoomsListFooter.displayName = 'RoomsListFooter';
