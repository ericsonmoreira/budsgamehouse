import Page from "@/components/Page";
import PaperGlass from "@/components/PaperGlass";
import ControlledTextField from "@/components/textfields/ControlledTextField";
import { auth } from "@/services/firebaseConfig";
import verifyFirebaseErroCode from "@/services/verifyFirebaseErroCode";
import { zodResolver } from "@hookform/resolvers/zod";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { AuthError } from "firebase/auth";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import schema, { SchemaData } from "./schema ";

function RecoverPassword() {
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<SchemaData>({
    resolver: zodResolver(schema),
  });

  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const { mutate: sendPasswordResetEmailMutation, isPending } = useMutation({
    mutationFn: async (email: string) => {
      await sendPasswordResetEmail(email);
    },
    onSuccess: () => {
      toast.success("Email enviado com sucesso");
    },
    onError: (e: Error) => {
      toast.error(e.message);
    },
  });

  const onSubmit: SubmitHandler<SchemaData> = async ({ email }) => {
    sendPasswordResetEmailMutation(email);
  };

  return (
    <Page loading={isPending}>
      <PaperGlass>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6" gutterBottom>
            Redefinir senha
          </Typography>
          <Grid container spacing={1}>
            <Grid size={12}>
              <ControlledTextField
                autoFocus
                name="email"
                type="email"
                control={control}
                variant="outlined"
                size="small"
                label="Email"
                fullWidth
              />
              {error && (
                <Typography sx={{ color: (theme) => theme.palette.error.dark }}>
                  {verifyFirebaseErroCode((error as AuthError).code)}
                </Typography>
              )}
            </Grid>
            <Grid size={12}>
              <Stack direction="row" spacing={1}>
                <Button
                  disableElevation
                  variant="outlined"
                  disabled={sending}
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(-1)}
                >
                  Voltar
                </Button>
                <Button
                  disableElevation
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={sending || !!error} // necessário travar o botão quando acontece um errro
                >
                  Enviar
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </PaperGlass>
    </Page>
  );
}

export default RecoverPassword;
