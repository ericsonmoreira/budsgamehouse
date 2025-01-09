import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import routesNames from "../../../../routes/routesNames";
import { auth } from "../../../../services/firebaseConfig";

type ViewUserDialogProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & DialogProps;

function ViewUserDialog({ setOpen, ...rest }: ViewUserDialogProps) {
  const [user] = useAuthState(auth);

  const navigate = useNavigate();

  const registrationCompleted = useMemo(() => {
    if (user) {
      return !!user.photoURL && !!user.displayName;
    }

    return false;
  }, [user]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCompleteRegistration = () => {
    setOpen(false);

    navigate(routesNames.SETTINGS);
  };

  if (!user) return null;

  return (
    <Dialog {...rest} fullWidth maxWidth="md" onClose={handleClose}>
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
        {!registrationCompleted && (
          <Button onClick={handleCompleteRegistration}>
            Concluir cadastro
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ViewUserDialog;
