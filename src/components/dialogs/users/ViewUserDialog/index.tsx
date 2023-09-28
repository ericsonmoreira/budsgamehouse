import { Dialog, DialogContent, DialogContentText, DialogProps, DialogTitle } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../../services/firebaseConfig';

const ViewUserDialog: React.FC<DialogProps> = ({ ...rest }) => {
  const [user] = useAuthState(auth);

  if (!user) return null;

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>Usuário</DialogTitle>
      <DialogContent>
        <DialogContentText>Email: {user.email}</DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserDialog;
