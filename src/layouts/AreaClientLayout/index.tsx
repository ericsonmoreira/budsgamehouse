import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import BackGroundLoginPageImg from '../../assets/bgLogin.jpg';

const AreaClientLayout: React.FC = () => {
  const { palette } = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: palette.background.default,
        backgroundImage: `url(${BackGroundLoginPageImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        width: '100%',
        overflowY: 'auto',
      }}
    >
      <Outlet />
    </Box>
  );
};

export default AreaClientLayout;
