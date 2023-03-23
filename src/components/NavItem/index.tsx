import { Box, Button, ListItem, ListItemProps } from '@mui/material';
import { NavLink } from 'react-router-dom';

export type NavItemProps = {
  to: string;
  icon: React.FC;
  title: string;
  active: boolean;
};

const NavItem: React.FC<NavItemProps & ListItemProps> = ({
  to,
  icon: Icon,
  title,
  active,
  ...rest
}) => {
  return (
    <ListItem
      disableGutters
      sx={{
        display: 'flex',
        py: 0,
        px: 1,
      }}
      {...rest}
    >
      <NavLink to={to} style={{ textDecoration: 'none' }}>
        <Button
          startIcon={<Icon />}
          disableRipple
          sx={{
            borderRadius: 1,
            color: active ? 'secondary.main' : 'neutral.300',
            justifyContent: 'flex-start',
            px: 2,
            textAlign: 'left',
            textTransform: 'none',
            width: '100%',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>{title}</Box>
        </Button>
      </NavLink>
    </ListItem>
  );
};

export default NavItem;
