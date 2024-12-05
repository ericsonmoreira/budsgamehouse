import { zodResolver } from "@hookform/resolvers/zod";
import {
  Backdrop,
  Box,
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import updatePlayer from "../../../../resources/players/updatePlayer";
import uploadImageInStorage from "../../../../resources/uploadImageInStorage";
import ImageDropZone from "../../../ImageDropZone";
import ControlledTextField from "../../../textfields/ControlledTextField";
import schema, { UpdatePlayerDialogFormData } from "./schema ";
import ControlledPhoneTextField from "../../../textfields/ControlledPhoneTextField";
import AvatarPlayer from "../../../AvatarPlayer";

type UpdatePlayerDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  playerToUpdate: Player;
};

const UpdatePlayerDialog: React.FC<UpdatePlayerDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  playerToUpdate,
  ...rest
}) => {
  const queryClient = useQueryClient();

  const [file, setFile] = useState<File | null>();

  const { control, handleSubmit, reset } = useForm<UpdatePlayerDialogFormData>({
    resolver: zodResolver(schema),
  });

  const handleConfirmAction = async (data: UpdatePlayerDialogFormData) => {
    updatePlayerMutate(data);
  };

  const handleClose = () => {
    reset({
      name: "",
      email: "",
      phone: "",
    });

    setFile(null);

    setOpen(false);
  };

  const { mutate: updatePlayerMutate, isPending: updatePlayerIsLoading } =
    useMutation({
      mutationFn: async ({
        email,
        name,
        phone,
      }: UpdatePlayerDialogFormData) => {
        if (file) {
          const avatarImgUrl = await uploadImageInStorage(file);

          await updatePlayer({
            id: playerToUpdate.id,
            name,
            email,
            balance: playerToUpdate.balance,
            avatarImgUrl,
            phone,
          });
        } else {
          await updatePlayer({
            id: playerToUpdate.id,
            name,
            email,
            balance: playerToUpdate.balance,
            avatarImgUrl: playerToUpdate.avatarImgUrl,
            phone,
          });
        }

        await queryClient.invalidateQueries({ queryKey: ["usePlayers"] });

        await queryClient.invalidateQueries({
          queryKey: ["usePlayer", playerToUpdate.id],
        });
      },
      onSuccess: () => {
        handleClose();

        toast.success("Player atualizado com sucesso");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });

  useEffect(() => {
    reset({
      name: playerToUpdate.name,
      email: playerToUpdate.email,
      phone: playerToUpdate.phone,
    });
  }, [playerToUpdate]);

  return (
    <Dialog {...rest} fullScreen onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subTitle}</DialogContentText>
        <Box display="flex" alignItems="center" justifyContent="center">
          <AvatarPlayer
            sx={{ width: 64, height: 64 }}
            playerId={playerToUpdate.id}
          />
        </Box>
        <Stack
          spacing={2}
          sx={{
            display: "flex",
            flex: 1,
            marginY: 2,
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
        <Button
          variant="contained"
          color="error"
          disableElevation
          onClick={handleClose}
        >
          Cancelar
        </Button>
        <Button onClick={handleSubmit(handleConfirmAction)} autoFocus>
          Confirmar
        </Button>
      </DialogActions>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={updatePlayerIsLoading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </Dialog>
  );
};

export default UpdatePlayerDialog;
