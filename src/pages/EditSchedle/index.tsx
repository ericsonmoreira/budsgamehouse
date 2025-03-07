import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import RichTextEditor from "@/components/RichTextEditor";
import ControlledCurrencyTextField from "@/components/textfields/ControlledCurrencyTextField";
import ControlledDateTimePicker from "@/components/textfields/ControlledDateTimePicker";
import ControlledTextField from "@/components/textfields/ControlledTextField";
import useRickTextEditor from "@/hooks/useRickTextEditor";
import useSchedle from "@/hooks/useSchedle";
import { SaveIcon } from "@/icons";
import updateSchedule from "@/resources/schedules/updateSchedule";
import routesNames from "@/routes/routesNames";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Grid2 as Grid,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import schema, { SchemaData } from "./schema";

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

  const navigate = useNavigate();

  const { data: schedle, isLoading: isLoadingSchedle } = useSchedle(id);

  const queryClient = useQueryClient();

  const editor = useRickTextEditor();

  const { handleSubmit, control } = useForm<SchemaData>({
    resolver: zodResolver(schema),
    values: schedle
      ? {
          ...schedle,
          start: schedle.start.toDate(),
          createdAt: schedle.createdAt.toDate(),
        }
      : undefined,
  });

  const {
    mutate: updateScheduleMutate,
    isPending: updateScheduleMutateIsloading,
  } = useMutation({
    mutationFn: async (data: SchemaData) => {
      if (editor) {
        await updateSchedule({
          ...data,
          description: editor.getHTML(),
          start: Timestamp.fromDate(new Date(data.start)),
          createdAt: Timestamp.now(),
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["useSchedules"] });

      await queryClient.invalidateQueries({
        queryKey: ["useSchedle", data.id],
      });
    },
    onSuccess: () => {
      navigate(routesNames.SCHEDULES);

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
    if (schedle && editor) {
      editor.commands.setContent(schedle.description);
    }
  }, [schedle, editor]);

  return (
    <Page loading={updateScheduleMutateIsloading || isLoadingSchedle}>
      <PageHeader title="Editar Programação" containsBackButton />
      <Box padding={1}>
        {schedle && (
          <Paper
            sx={{ padding: 2 }}
            component="form"
            onSubmit={handleSubmit(handleConfirmAction)}
          >
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
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Descrição
                </Typography>
                <RichTextEditor editor={editor} />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="outlined"
              color="success"
              sx={{ mt: 2 }}
              endIcon={<SaveIcon />}
            >
              Salvar
            </Button>
          </Paper>
        )}
      </Box>
    </Page>
  );
}

export default EditSchedle;
