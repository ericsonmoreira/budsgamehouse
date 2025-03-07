import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import RichTextEditor from "@/components/RichTextEditor";
import ControlledCurrencyTextField from "@/components/textfields/ControlledCurrencyTextField";
import ControlledDateTimePicker from "@/components/textfields/ControlledDateTimePicker";
import ControlledTextField from "@/components/textfields/ControlledTextField";
import useRickTextEditor from "@/hooks/useRickTextEditor";
import { SaveIcon } from "@/icons";
import addSchedule from "@/resources/schedules/addSchedule";
import routesNames from "@/routes/routesNames";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Grid2 as Grid, MenuItem, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import schema, { SchemaData } from "./schema";

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

function CreateSchedle() {
  const navigate = useNavigate();

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

  const { handleSubmit, control } = useForm<SchemaData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      format: "Pioneer",
      price: 0,
      start: new Date(),
    },
  });

  const { mutate: addScheduleMutate, isPending: addScheduleMutateIsloading } =
    useMutation({
      mutationFn: async (data: SchemaData) => {
        if (editor) {
          await addSchedule({
            ...data,
            description: editor.getHTML(),
            start: Timestamp.fromDate(new Date(data.start)),
            createdAt: Timestamp.now(),
          });
        }

        await queryClient.invalidateQueries({ queryKey: ["useSchedules"] });
      },
      onSuccess: () => {
        navigate(routesNames.SCHEDULES);

        toast.success("Produto adicionado com sucesso");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });

  const handleConfirmAction = (data: SchemaData) => {
    addScheduleMutate(data);
  };

  return (
    <Page loading={addScheduleMutateIsloading}>
      <PageHeader title="Criar Programação" containsBackButton />
      <Grid
        container
        spacing={1}
        p={1}
        component="form"
        onSubmit={handleSubmit(handleConfirmAction)}
      >
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
          <ControlledDateTimePicker
            name="start"
            control={control}
            slotProps={{
              textField: {
                fullWidth: true,
                size: "small",
              },
            }}
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
          <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
            Descrição
          </Typography>
          <RichTextEditor editor={editor} />
        </Grid>
        <Grid size={12} justifyContent="flex-end" display="flex">
          <Button variant="contained" startIcon={<SaveIcon />} type="submit">
            Salvar
          </Button>
        </Grid>
      </Grid>
    </Page>
  );
}

export default CreateSchedle;
