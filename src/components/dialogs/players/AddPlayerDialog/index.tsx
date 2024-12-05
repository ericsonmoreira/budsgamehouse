import { zodResolver } from "@hookform/resolvers/zod";
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import addPlayer from "../../../../resources/players/addPlayer";
import uploadImageInStorage from "../../../../resources/uploadImageInStorage";
import ImageDropZone from "../../../ImageDropZone";
import ControlledPhoneTextField from "../../../textfields/ControlledPhoneTextField";
import ControlledTextField from "../../../textfields/ControlledTextField";
import schema, { AddPlayerDialogFormData } from "./schema ";

type AddPlayerDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddPlayerDialog: React.FC<AddPlayerDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  ...rest
}) => {
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm<AddPlayerDialogFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const [file, setFile] = useState<File | null>();

  const { mutate: addPlayerMutate, isPending: addPlayerIsLoading } =
    useMutation({
      mutationFn: async ({ name, email, phone }: AddPlayerDialogFormData) => {
        if (file) {
          const avatarImgUrl = await uploadImageInStorage(file);

          await addPlayer({ name, balance: 0, email, avatarImgUrl, phone });
        } else {
          await addPlayer({ name, balance: 0, email, phone });
        }

        await queryClient.invalidateQueries({ queryKey: ["usePlayers"] });
      },
      onSuccess: () => {
        handleClose();

        toast.success("Produto adicionado com sucesso");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });

  const handleConfirmAction = (data: AddPlayerDialogFormData) => {
    addPlayerMutate(data);
  };

  const handleClose = () => {
    reset({
      email: "",
      name: "",
      phone: "",
    });

    setFile(null);

    setOpen(false);
  };

  return (
    <Dialog {...rest} fullScreen onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subTitle}</DialogContentText>
        <Stack
          spacing={2}
          sx={{
            display: "flex",
            flex: 1,
            marginTop: 1,
          }}
        >
          <ImageDropZone file={file} setFile={setFile} />
          <ControlledTextField
            name="name"
            control={control}
            variant="outlined"
            size="small"
            label="Nome"
          />
          <ControlledPhoneTextField
            name="phone"
            control={control}
            variant="outlined"
            size="small"
            label="Telefone"
          />
          <ControlledTextField
            name="email"
            control={control}
            variant="outlined"
            size="small"
            label="Email"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit(handleConfirmAction)}>Confirmar</Button>
      </DialogActions>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={addPlayerIsLoading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </Dialog>
  );
};

export default AddPlayerDialog;
