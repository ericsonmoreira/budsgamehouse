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
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Highlight from "@tiptap/extension-highlight";
import TypographyTiptap from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Timestamp } from "firebase/firestore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import addSchedule from "../../../../resources/schedules/addSchedule";
import ControlledTextField from "../../../textfields/ControlledTextField";
import schema, { SchemaData } from "./schema";
import ControlledCurrencyTextField from "../../../textfields/ControlledCurrencyTextField";

type AddSchedulesDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const formats: MTGFormat[] = [
  "Standard",
  "Modern",
  "Pioneer",
  "Legacy",
  "Vintage",
  "Commander",
  "Brawl",
  "Pauper",
  "Draft",
  "Sealed",
];

const AddSchedulesDialog: React.FC<AddSchedulesDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  ...rest
}) => {
  const queryClient = useQueryClient();

  const editor = useEditor({
    extensions: [StarterKit, Highlight, TypographyTiptap],
    content: "teste",
  });

  const { handleSubmit, reset, control } = useForm<SchemaData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      start: new Date(),
      price: 0,
      format: "Pioneer",
    },
  });

  const { mutate: addScheduleMutate, isPending: addScheduleMutateIsloading } =
    useMutation({
      mutationFn: async ({ title, start, price }: SchemaData) => {
        if (editor) {
          await addSchedule({
            title,
            format: "Pioneer",
            price,
            description: editor.getHTML(),
            start: Timestamp.fromDate(start),
            createdAt: Timestamp.now(),
          });
        }

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
      start: new Date(),
    });

    setOpen(false);
  };

  return (
    <Dialog {...rest} fullScreen onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{subTitle}</DialogContentText>
        <Grid container spacing={2}>
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
          <Grid item xs={4}>
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
          <Grid item xs={4}>
            <ControlledCurrencyTextField
              name="price"
              control={control}
              variant="outlined"
              size="small"
              label="Valor Inscrição"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <ControlledTextField
              name="format"
              control={control}
              variant="outlined"
              size="small"
              label="Formato"
              defaultValue="Pioneer"
              select
              fullWidth
            >
              {formats.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </ControlledTextField>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Descrição
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                px: 2,
              }}
            >
              <EditorContent editor={editor} />
            </Paper>
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
