import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";

interface DialogOptions {
  title: string;
  message: string;
}

type ConfirmationDialogProps = {
  handleConfirm(): void;
  handleCancel(): void;
} & DialogProps &
  DialogOptions;

const ConfirmationDialog = ({
  handleCancel,
  handleConfirm,
  message,
  title,
  open,
  ...rest
}: ConfirmationDialogProps) => (
  <Dialog open={open} onClose={handleCancel} {...rest}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCancel} variant="contained" color="warning">
        Cancelar
      </Button>
      <Button
        onClick={handleConfirm}
        variant="outlined"
        color="success"
        autoFocus
      >
        Confirmar
      </Button>
    </DialogActions>
  </Dialog>
);

// Função que exibe o diálogo e retorna uma Promise que espera o resultado
const useConfirmation = () => {
  const [open, setOpen] = useState(false);

  const [dialogOptions, setDialogOptions] = useState<DialogOptions>({
    title: "",
    message: "",
  });

  const [resolveCallback, setResolveCallback] =
    useState<(value: boolean) => void>();

  const showDialog = (dialogOptions: DialogOptions) => {
    setDialogOptions(dialogOptions);

    setOpen(true);

    return new Promise((resolve) => {
      setResolveCallback(() => resolve);
    });
  };

  const handleConfirm = () => {
    setOpen(false);
    if (resolveCallback) resolveCallback(true);
  };

  const handleCancel = () => {
    setOpen(false);
    if (resolveCallback) resolveCallback(false);
  };

  return {
    showDialog,
    confirmationDialog: (props: Omit<DialogProps, "open" | "close">) => (
      <ConfirmationDialog
        open={open}
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
        {...dialogOptions}
        {...props}
      />
    ),
  };
};

export default useConfirmation;
