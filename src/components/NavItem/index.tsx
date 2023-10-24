import { Button, ListItem, ListItemProps } from '@mui/material';
import { NavLink } from 'react-router-dom';

export type NavItemProps = {
  to: string;
  icon: React.FC;
  title: string;
  active: boolean;
};

const NavItem: React.FC<NavItemProps & ListItemProps> = ({ to, icon: Icon, title, active, ...rest }) => {
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
      <NavLink to={to} style={{ textDecoration: 'none', width: '100%' }}>
        <Button
          startIcon={<Icon />}
          sx={({ palette }) => ({
            borderRadius: 1,
            color: active ? palette.secondary.main : 'neutral.300',
            justifyContent: 'flex-start',
            px: 2,
            textAlign: 'left',
            textTransform: 'none',
            width: '100%',
            position: 'relative',
            '&::after': {
              position: 'absolute',
              top: 'center',
              left: 0,
              height: 'calc(100% - 8px)',
              borderRadius: '2px',
              width: '4px',
              backgroundColor: palette.secondary.main,
              content: '""',
              display: active ? 'block' : 'none',
            },
          })}
        >
          {title}
        </Button>
      </NavLink>
    </ListItem>
  );
};

export default NavItem;
