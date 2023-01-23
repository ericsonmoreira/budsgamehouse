import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  AppBarProps,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
}));

type DashboardNavbarProps = {
  onSidebarOpen(): void;
};

const DashboardNavbar: React.FC<DashboardNavbarProps & AppBarProps> = ({
  onSidebarOpen,
  ...rest
}) => {
  return (
    <DashboardNavbarRoot
      sx={{
        left: {
          lg: 280,
        },
        width: {
          lg: "calc(100% - 280px)",
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
              xs: "inline-flex",
              lg: "none",
            },
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <Tooltip title="Buscar">
          <IconButton>
            <SearchIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Contacts">
          <IconButton>
            <PersonIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </DashboardNavbarRoot>
  );
};

export default DashboardNavbar;
