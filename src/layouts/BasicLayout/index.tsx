import { Box, Container, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import BackGroundLoginPageImg from '../../assets/bgLogin.png';

const BasicLayout: React.FC = () => {
  const theme = useTheme();

  const upLg = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        backgroundImage: `url(${BackGroundLoginPageImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: upLg ? 'row' : 'column',
          height: '100vh',
        }}
      >
        <Box
          sx={{
            padding: 1,
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/atm-logo.png"
            style={{ maxWidth: '100%', width: 'auto' }}
          />
        </Box>
        <Box
          sx={{
            padding: 1,
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            alignItems: 'center',
            justifyContent: upLg ? 'center' : 'flex-start',
          }}
        >
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
};

export default BasicLayout;
