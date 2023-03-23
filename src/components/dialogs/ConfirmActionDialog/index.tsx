import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from '@mui/material';
import { toast } from 'react-hot-toast';

type ConfirmActionDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirmAction(): void;
  confirmationMesage: string;
};

const ConfirmActionDialog: React.FC<ConfirmActionDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  handleConfirmAction,
  confirmationMesage,
  ...rest
}) => {
  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subTitle}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpen(false)}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => {
            handleConfirmAction();
            setOpen(false);
            toast.success(confirmationMesage);
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmActionDialog;
