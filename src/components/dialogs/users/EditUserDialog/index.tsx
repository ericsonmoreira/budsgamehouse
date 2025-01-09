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
import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import uploadImageInStorage from "../../../../resources/uploadImageInStorage";
import { auth } from "../../../../services/firebaseConfig";
import ImageDropZone from "../../../ImageDropZone";
import ControlledTextField from "../../../textfields/ControlledTextField";
import schema, { SchemaData } from "./schema ";

type EditUserDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & DialogProps;

function EditUserDialog({
  title,
  setOpen,
  subTitle,
  ...rest
}: EditUserDialogProps) {
  const queryClient = useQueryClient();

  const [user] = useAuthState(auth);

  const { control, handleSubmit, setValue } = useForm<SchemaData>({
    resolver: zodResolver(schema),
  });

  const [file, setFile] = useState<File | null>();

  const { mutate: editUserMutate, isPending: editUserIsLoading } = useMutation({
    mutationFn: async ({ name }: SchemaData) => {
      if (user) {
        if (file) {
          const photoURL = await uploadImageInStorage(file);

          await updateProfile(user, {
            displayName: name,
            photoURL,
          });
        } else {
          await updateProfile(user, {
            displayName: name,
          });
        }

        await updateProfile(user, {
          displayName: name,
        });
      } else {
        throw new Error("Usuário não encontrado");
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

  const handleConfirmAction = (data: SchemaData) => {
    editUserMutate(data);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (user) {
      setValue("name", user.displayName ?? "");
    }
  }, [user, setValue]);

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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit(handleConfirmAction)}>Confirmar</Button>
      </DialogActions>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={editUserIsLoading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </Dialog>
  );
}

export default EditUserDialog;
