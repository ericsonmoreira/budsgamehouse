import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import {
  AppBar,
  AppBarProps,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import ViewUserDialog from "../dialogs/ViewUserDialog";

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
  const [viewUserDialogOpen, setViewUserDialogOpen] = useState(false);

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
              xs: "inline-flex",
              lg: "none",
            },
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <img
            src="/atm-logo.png"
            alt="Atm Logo"
            style={{ width: "3rem", height: "3rem" }}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Usuário">
          <IconButton onClick={() => setViewUserDialogOpen(true)}>
            <PersonIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Toolbar>
      <ViewUserDialog
        open={viewUserDialogOpen}
        onClose={() => setViewUserDialogOpen(false)}
      />
    </DashboardNavbarRoot>
  );
};

export default DashboardNavbar;
