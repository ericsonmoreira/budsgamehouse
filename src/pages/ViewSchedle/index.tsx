import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { EditorContent } from "@tiptap/react";
import { format } from "date-fns";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useCopyToClipboard } from "usehooks-ts";
import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import useRickTextEditor from "../../hooks/useRickTextEditor";
import useSchedle from "../../hooks/useSchedle";
import {
  CalendarMonthIcon,
  ContentCopyIcon,
  PixIcon,
  VideogameAssetIcon,
} from "../../icons";
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

  const [_, copy] = useCopyToClipboard();

  const handleCopy = async () => {
    if (editor) {
      await copy(
        editor
          .getText()
          .split("\n")
          .filter((line) => line.trim() !== "")
          .join("\n"),
      );

      toast.success("Texto cópiado com sucesso.");
    }
  };

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
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h5">{data.title}</Typography>
                <Button
                  size="large"
                  variant="outlined"
                  color="info"
                  onClick={handleCopy}
                  startIcon={<ContentCopyIcon />}
                >
                  Copiar Conteúdo
                </Button>
              </Box>

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
