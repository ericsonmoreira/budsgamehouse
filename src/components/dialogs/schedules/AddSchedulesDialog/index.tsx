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
  Grid,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import addSchedule from "../../../../resources/schedules/addSchedule";
import ControlledTextField from "../../../textfields/ControlledTextField";
import schema, { SchemaData } from "./schema";

type AddSchedulesDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddSchedulesDialog: React.FC<AddSchedulesDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  ...rest
}) => {
  const queryClient = useQueryClient();

  const { handleSubmit, reset, control } = useForm<SchemaData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      end: new Date(),
      start: new Date(),
    },
  });

  const { mutate: addScheduleMutate, isPending: addScheduleMutateIsloading } =
    useMutation({
      mutationFn: async ({ title, description, end, start }: SchemaData) => {
        addSchedule({
          title,
          description,
          end: Timestamp.fromDate(end),
          start: Timestamp.fromDate(start),
          createdAt: Timestamp.now(),
        });

        await queryClient.invalidateQueries({ queryKey: ["useSchedules"] });
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
    addScheduleMutate(data);
  };

  const handleClose = () => {
    reset({
      title: "",
      description: "",
      end: new Date(),
      start: new Date(),
    });

    setOpen(false);
  };

  return (
    <Dialog {...rest} fullScreen onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{subTitle}</DialogContentText>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <ControlledTextField
              name="title"
              control={control}
              variant="outlined"
              size="small"
              label="Título"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <ControlledTextField
              name="start"
              type="datetime-local"
              control={control}
              variant="outlined"
              size="small"
              label="Início"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <ControlledTextField
              name="end"
              type="datetime-local"
              control={control}
              variant="outlined"
              size="small"
              label="Fim"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledTextField
              name="description"
              control={control}
              variant="outlined"
              size="small"
              label="Descrição"
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit(handleConfirmAction)} autoFocus>
          Confirmar
        </Button>
      </DialogActions>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={addScheduleMutateIsloading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </Dialog>
  );
};

export default AddSchedulesDialog;
