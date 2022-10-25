import { styled, experimental_sx as sx } from '@mui/system';

export const ListWrapper = styled('div')(
  sx({
    height: 'calc(100% - 120px)',
    overflow: 'auto',
    position: 'relative',
  }),
);
