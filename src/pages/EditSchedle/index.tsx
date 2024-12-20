import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Grid, MenuItem, Paper, Typography } from "@mui/material";
import Highlight from "@tiptap/extension-highlight";
import TypographyTiptap from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import ControlledCurrencyTextField from "../../components/textfields/ControlledCurrencyTextField";
import ControlledTextField from "../../components/textfields/ControlledTextField";
import useSchedle from "../../hooks/useSchedle";
import schema, { SchemaData } from "./schema";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateSchedule from "../../resources/schedules/updateSchedule";
import { Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";

type EditSchedleParams = {
  id: string;
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

function EditSchedle() {
  const { id } = useParams<EditSchedleParams>();

  const { data, isLoading: isLoadingData } = useSchedle(id);

  const queryClient = useQueryClient();

  const editor = useEditor({
    extensions: [StarterKit, Highlight, TypographyTiptap],
  });

  const { handleSubmit, reset, control } = useForm<SchemaData>({
    resolver: zodResolver(schema),
  });

  const {
    mutate: updateScheduleMutate,
    isPending: updateScheduleMutateIsloading,
  } = useMutation({
    mutationFn: async ({ title, start, price }: SchemaData) => {
      if (data && editor) {
        await updateSchedule({
          id: data.id,
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
      toast.success("Programação salva com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleConfirmAction = (data: SchemaData) => {
    updateScheduleMutate(data);
  };

  useEffect(() => {
    if (data && editor) {
      reset({
        format: data.format,
        price: data.price,
        start: format(data.start.toDate(), "yyyy-MM-dd'T'HH:mm"),
        title: data.title,
      });

      editor.commands.setContent(data.description);
    }
  }, [data, editor, reset]);

  return (
    <Page loading={updateScheduleMutateIsloading || isLoadingData}>
      <PageHeader title="Editar Programação" containsBackButton />
      <Box padding={1}>
        {data && (
          <Paper
            sx={{ padding: 2 }}
            component="form"
            onSubmit={handleSubmit(handleConfirmAction)}
          >
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
                  InputLabelProps={{ shrink: true }}
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
            <Button type="submit">Salvar</Button>
          </Paper>
          // <Paper sx={{ padding: 1 }}>
          //   <Stack direction="column" spacing={1}>
          //     <Typography variant="h5">{data.title}</Typography>
          //     <Stack
          //       spacing={1}
          //       direction="row"
          //       display="flex"
          //       alignItems="center"
          //     >
          //       <CalendarMonthIcon />
          //       <Typography>
          //         {format(data.start.toDate(), "dd/MM/yy HH:mm")}
          //       </Typography>
          //     </Stack>
          //     <Stack
          //       spacing={1}
          //       direction="row"
          //       display="flex"
          //       alignItems="center"
          //     >
          //       <AttachMoneyIcon />
          //       <Typography>
          //         Inscrição: {formatterCurrencyBRL.format(data.price)}
          //       </Typography>
          //     </Stack>
          //     <Divider />
          //     <EditorContent editor={editor} />
          //   </Stack>
          // </Paper>
        )}
      </Box>
    </Page>
  );
}

export default EditSchedle;
