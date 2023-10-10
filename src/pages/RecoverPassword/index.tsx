import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AuthError } from 'firebase/auth';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/Page';
import PaperGlass from '../../components/PaperGlass';
import ControlledTextField from '../../components/textfields/ControlledTextField';
import { auth } from '../../services/firebaseConfig';
import verifyFirebaseErroCode from '../../services/verifyFirebaseErroCode';
import schema from './schema ';

type RecoverPasswordData = {
  email: string;
};

const RecoverPassword: React.FC = () => {
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<RecoverPasswordData>({
    resolver: yupResolver(schema),
  });

  const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);

  const { mutate: sendPasswordResetEmailMutation, isLoading } = useMutation({
    mutationFn: async (email: string) => {
      await sendPasswordResetEmail(email);
    },
    onSuccess: () => {
      toast.success('Email enviado com sucesso');
    },
    onError: (e: Error) => {
      toast.error(e.message);
    },
  });

  const onSubmit: SubmitHandler<RecoverPasswordData> = async ({ email }) => {
    sendPasswordResetEmailMutation(email);
  };

  return (
    <Page loading={isLoading}>
      <PaperGlass>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            spacing={2}
            sx={{
              display: 'flex',
              flex: 1,
            }}
          >
            <Typography variant="h6">Redefinir senha</Typography>
            <ControlledTextField
              autoFocus
              name="email"
              control={control}
              variant="outlined"
              size="small"
              label="Email"
            />
            {error && (
              <Typography sx={{ color: (theme) => theme.palette.error.dark }}>
                {verifyFirebaseErroCode((error as AuthError).code)}
              </Typography>
            )}
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <Button
                disableElevation
                type="submit"
                variant="text"
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
                disabled={sending || !!error} // necessário travar o botão quando acontece um errro
                endIcon={sending && <CircularProgress size={12} color="info" sx={{ marginLeft: 2 }} />}
              >
                Enviar
              </Button>
            </Box>
          </Stack>
        </form>
      </PaperGlass>
    </Page>
  );
};

export default RecoverPassword;
