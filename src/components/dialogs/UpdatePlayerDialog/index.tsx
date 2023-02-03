import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import usePlayers from "../../../hooks/usePlayers";
import ControlledTextField from "../../textfields/ControlledTextField";
import schema from "./schema ";

export type PlayerUpdateData = {
  id: string;
  name: string;
  email: string;
};

type UpdatePlayerDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  playerToUpdate: PlayerUpdateData;
};

type UpdatePlayerDialogFormData = {
  name: string;
  email: string;
};

const UpdatePlayerDialog: React.FC<UpdatePlayerDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  playerToUpdate,
  ...rest
}) => {
  const { id, name, email } = playerToUpdate;

  const { updatePlayer } = usePlayers();

  const { control, handleSubmit, setValue } =
    useForm<UpdatePlayerDialogFormData>({
      resolver: yupResolver(schema),
    });

  const handleConfirmAction = ({ name, email }: UpdatePlayerDialogFormData) => {
    updatePlayer({ id, name, email });

    toast.success("Player atualizado com sucesso!");

    setOpen(false);
  };

  const handleCancelAction = () => {
    setOpen(false);
  };

  useEffect(() => {
    setValue("name", name);
    setValue("email", email);
  }, [playerToUpdate]);

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subTitle}</DialogContentText>
        <Stack
          spacing={2}
          sx={{
            display: "flex",
            flex: 1,
            marginY: 2,
          }}
        >
          <ControlledTextField
            name="name"
            control={control}
            textFieldProps={{
              variant: "outlined",
              size: "small",
              label: "Nome",
            }}
          />
          <ControlledTextField
            name="email"
            control={control}
            textFieldProps={{
              variant: "outlined",
              size: "small",
              label: "Email",
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="error"
          disableElevation
          onClick={handleCancelAction}
        >
          Cancelar
        </Button>
        <Button onClick={handleSubmit(handleConfirmAction)} autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePlayerDialog;
