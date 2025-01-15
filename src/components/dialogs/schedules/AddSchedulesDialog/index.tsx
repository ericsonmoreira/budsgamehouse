import RichTextEditor from "@/components/RichTextEditor";
import ControlledCurrencyTextField from "@/components/textfields/ControlledCurrencyTextField";
import ControlledTextField from "@/components/textfields/ControlledTextField";
import useRickTextEditor from "@/hooks/useRickTextEditor";
import addSchedule from "@/resources/schedules/addSchedule";
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
  Grid2 as Grid,
  MenuItem,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import schema, { SchemaData } from "./schema";

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

  const editor = useRickTextEditor({
    content: `
      <h1>Guia Rápido de Markdown</h1>
      <p>Markdown é uma linguagem de marcação simples para formatar textos. Aqui estão alguns exemplos básicos:</p>
      <h2>Títulos</h2>
      <p>Use <code>#</code> para criar títulos. Quanto mais <code>#</code>, menor o nível do título.</p>
      <h2>Listas</h2>
      <ul>
        <li>Use <code>-</code> ou <code>*</code> para listas não ordenadas.</li>
      </ul>
      <ol>
        <li>Use números para listas ordenadas.</li>
      </ol>
      <h2>Ênfase</h2>
      <ul>
        <li><em>Itálico</em>: Use <code>*texto*</code> ou <code>_texto_</code>.</li>
        <li><strong>Negrito</strong>: Use <code>**texto**</code> ou <code>__texto__</code>.</li>
      </ul>
      <h2>Links</h2>
      <p>Crie links assim: <code>[texto](url)</code>.</p>
      <p>Experimente agora!</p>
    `,
  });

  const { handleSubmit, reset, control } = useForm<SchemaData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      start: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
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
            start: Timestamp.fromDate(new Date(start)),
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
      format: "Pioneer",
      price: 0,
      start: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    });

    setOpen(false);
  };

  return (
    <Dialog {...rest} fullScreen onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{subTitle}</DialogContentText>
        <Grid container spacing={2}>
          <Grid size={12}>
            <ControlledTextField
              name="title"
              control={control}
              variant="outlined"
              size="small"
              label="Título"
              fullWidth
            />
          </Grid>
          <Grid size={4}>
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
          <Grid size={4}>
            <ControlledCurrencyTextField
              name="price"
              control={control}
              variant="outlined"
              size="small"
              label="Valor Inscrição"
              fullWidth
            />
          </Grid>
          <Grid size={4}>
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
          <Grid size={12}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Descrição
            </Typography>
            <RichTextEditor editor={editor} />
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
