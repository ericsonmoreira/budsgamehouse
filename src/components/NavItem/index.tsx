import { NavLink } from "react-router-dom";
import { Box, Button, ListItem, ListItemProps } from "@mui/material";

export type NavItemProps = {
  to: string;
  icon: React.FC;
  title: string;
};

const NavItem: React.FC<NavItemProps & ListItemProps> = ({
  to,
  icon: Icon,
  title,
  ...rest
}) => {
  return (
    <ListItem
      disableGutters
      sx={{
        display: "flex",
        py: 0,
        px: 1,
      }}
      {...rest}
    >
      <NavLink to={to} style={{ textDecoration: "none" }}>
        <Button
          startIcon={<Icon />}
          disableRipple
          sx={{
            borderRadius: 1,
            justifyContent: "flex-start",
            px: 2,
            textAlign: "left",
            textTransform: "none",
            width: "100%",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>{title}</Box>
        </Button>
      </NavLink>
    </ListItem>
  );
};

export default NavItem;
