import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Divider,
  Drawer,
  DrawerProps,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

type AppDrawerItemData = {
  label: string;
  icon: React.FC;
};

const itens: AppDrawerItemData[] = [
  {
    label: "Home",
    icon: HomeIcon,
  },
  {
    label: "Cartas Troca",
    icon: ChangeCircleIcon,
  },
  {
    label: "Want List",
    icon: SearchIcon,
  },
];

const ListAppDrawer = () => {
  return (
    <List>
      {itens.map(({ icon: Icon, label }) => (
        <ListItem key={label}>
          <ListItemButton>
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

const AppDrawer: React.FC<DrawerProps> = (props) => {
  return (
    <Drawer variant="permanent" {...props}>
      <Box p={2}>
        <Typography>ATM</Typography>
      </Box>
      <Divider />
      <ListAppDrawer />
    </Drawer>
  );
};

export default AppDrawer;
