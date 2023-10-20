import { Avatar, Box, Dialog, DialogContent, DialogProps, DialogTitle, Stack, Typography } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../../services/firebaseConfig';

const ViewUserDialog: React.FC<DialogProps> = ({ ...rest }) => {
  const [user] = useAuthState(auth);

  if (!user) return null;

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>Usuário</DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center">
          <Avatar
            sx={({ spacing }) => ({ width: spacing(8), height: spacing(8) })}
            alt={user.displayName ?? undefined}
            src={user.photoURL ?? undefined}
          />
          <Stack m={2}>
            <Typography variant="h5">{user.displayName}</Typography>
            <Typography color="text.secondary">{user.email}</Typography>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserDialog;
