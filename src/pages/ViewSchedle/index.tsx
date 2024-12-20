import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { EditorContent } from "@tiptap/react";
import { format } from "date-fns";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import useRickTextEditor from "../../hooks/useRickTextEditor";
import useSchedle from "../../hooks/useSchedle";
import { CalendarMonthIcon, PixIcon, VideogameAssetIcon } from "../../icons";
import { formatterCurrencyBRL } from "../../utils/formatters";

type ViewSchedleParams = {
  id: string;
};

function ViewSchedle() {
  const { id } = useParams<ViewSchedleParams>();

  const { data } = useSchedle(id);

  const editor = useRickTextEditor({
    editable: false,
  });

  useEffect(() => {
    if (data && editor) {
      editor.commands.setContent(data.description);
    }
  }, [data, editor]);

  return (
    <Page>
      <PageHeader title="Programação" containsBackButton />
      <Box padding={1}>
        {data && (
          <Paper sx={{ padding: 1 }}>
            <Stack direction="column" spacing={1}>
              <Typography variant="h5">{data.title}</Typography>
              <Stack
                spacing={1}
                direction="row"
                display="flex"
                alignItems="center"
              >
                <CalendarMonthIcon />
                <Typography>
                  {format(data.start.toDate(), "dd/MM/yy HH:mm")}
                </Typography>
              </Stack>
              <Stack
                spacing={1}
                direction="row"
                display="flex"
                alignItems="center"
              >
                <PixIcon />
                <Typography>
                  Inscrição: {formatterCurrencyBRL.format(data.price)}
                </Typography>
              </Stack>
              <Stack
                spacing={1}
                direction="row"
                display="flex"
                alignItems="center"
              >
                <VideogameAssetIcon />
                <Typography>Formato: {data.format}</Typography>
              </Stack>
              <Divider />
              <EditorContent editor={editor} />
            </Stack>
          </Paper>
        )}
      </Box>
    </Page>
  );
}

export default ViewSchedle;
