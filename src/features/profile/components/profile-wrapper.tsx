import { styled, experimental_sx as sx } from '@mui/system';

export const ProfileWrapper = styled('div')(
  sx({
    height: 'calc(100% - 64px)',
    overflow: 'auto',
    position: 'relative',
    padding: '1rem',
  }),
);
