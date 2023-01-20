import {
  Box,
  Button,
  Divider,
  Drawer,
  Typography,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NavItem from "../NavItem";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../../services/firebaseConfig";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

type AppDrawerItemData = {
  to: string;
  icon: React.FC;
  title: string;
};

type DashboardSidebarProps = {
  open: boolean;
  onClose(): void;
};

const items: AppDrawerItemData[] = [
  {
    icon: HomeIcon,
    to: "/",
    title: "Home",
  },
  {
    icon: HomeIcon,
    to: "/",
    title: "Home",
  },
  {
    icon: HomeIcon,
    to: "/",
    title: "Home",
  },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  open,
  onClose,
}) => {
  const navigate = useNavigate();

  const [signOut] = useSignOut(auth);

  const theme = useTheme();

  const upLg = useMediaQuery(theme.breakpoints.up("lg"));

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div>
          <Box sx={{ px: 2 }}>
            <Box
              sx={{
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                px: 3,
                py: "11px",
                borderRadius: 1,
              }}
            >
              {/* Acho que aqui vai a logo da ATM */}
              <div>
                <Typography color="inherit" variant="subtitle1">
                  Acme Inc
                </Typography>
                <Typography color="neutral.400" variant="body2">
                  Your tier : Premium
                </Typography>
              </div>
            </Box>
          </Box>
        </div>
        <Divider
          sx={{
            my: 3,
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {items.map(({ icon, title, to }) => (
            <NavItem key={title} icon={icon} to={to} title={title} />
          ))}
        </Box>
        <Divider />
        <Box
          sx={{
            p: 1,
          }}
        >
          <IconButton color="error" onClick={handleSignOut}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>
    </>
  );

  if (upLg) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.900",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

export default DashboardSidebar;
