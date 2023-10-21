import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, AppBarProps, Avatar, Badge, Box, IconButton, Toolbar, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocalStorage } from 'usehooks-ts';
import { auth } from '../../services/firebaseConfig';
import ViewUserDialog from '../dialogs/users/ViewUserDialog';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
}));

type DashboardNavbarProps = {
  onSidebarOpen(): void;
};

const DashboardNavbar: React.FC<DashboardNavbarProps & AppBarProps> = ({ onSidebarOpen, ...rest }) => {
  const [viewUserDialogOpen, setViewUserDialogOpen] = useState(false);

  const [isDarkTheme, setIsDarkTheme] = useLocalStorage('darkTheme', true);

  const [user] = useAuthState(auth);

  const registrationCompleted = useMemo(() => {
    if (user) {
      return !!user.photoURL && !!user.displayName;
    }

    return false;
  }, [user]);

  const handleToggleTheme = () => {
    setIsDarkTheme((old) => !old);
  };

  return (
    <DashboardNavbarRoot
      sx={{
        left: {
          lg: 0,
        },
      }}
      {...rest}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: 64,
          left: 0,
          px: 2,
        }}
      >
        <IconButton
          onClick={onSidebarOpen}
          sx={{
            display: {
              xs: 'inline-flex',
              lg: 'none',
            },
            marginRight: 2,
          }}
          edge="start"
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <img src="/atm-logo.png" alt="Atm Logo" style={{ width: '3rem', height: '3rem' }} />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box>
          <Tooltip title="Tema da interface">
            <IconButton onClick={handleToggleTheme}>
              {isDarkTheme ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          {user && (
            <Tooltip title="Usuário">
              <IconButton onClick={() => setViewUserDialogOpen(true)}>
                <Badge badgeContent={1} color="primary" invisible={registrationCompleted}>
                  <Avatar
                    sx={({ spacing }) => ({ width: spacing(4), height: spacing(4) })}
                    alt={user.displayName ?? undefined}
                    src={user.photoURL ?? undefined}
                  />
                </Badge>
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
      <ViewUserDialog open={viewUserDialogOpen} setOpen={setViewUserDialogOpen} />
    </DashboardNavbarRoot>
  );
};

export default DashboardNavbar;
