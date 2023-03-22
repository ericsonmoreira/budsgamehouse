import { Box, CircularProgress } from '@mui/material';

const LoadingTransition: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingTransition;
