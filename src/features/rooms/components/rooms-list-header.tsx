import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Autocomplete, IconButton, Paper, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

interface RoomsListHeaderProps<T> {
  options: T[];
  onBack?: () => void;
}

const HeaderWrapper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  padding: '0.5rem',
  display: 'flex',
}));

export const RoomsListHeader = <T,>({
  options,
  onBack,
}: RoomsListHeaderProps<T>) => {
  return (
    <HeaderWrapper>
      <Autocomplete
        options={options}
        sx={{ width: '100%' }}
        renderInput={(params) => <TextField {...params} label="Movie" />}
        disabled
      />
      {onBack && (
        <IconButton aria-label="back" onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
      )}
    </HeaderWrapper>
  );
};
