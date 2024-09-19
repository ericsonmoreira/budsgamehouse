import { Box } from '@mui/material';
import Lottie from 'lottie-react';
import LoadingAnimation from '../../assets/lotties/loading.json';

const LoadingTransition: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100dvh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Lottie animationData={LoadingAnimation} style={{ width: '20%', height: '20%' }} />
    </Box>
  );
};

export default LoadingTransition;
