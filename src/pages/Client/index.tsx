import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/Page';
import PaperGlass from '../../components/PaperGlass';
import ControlledTextField from '../../components/textfields/ControlledTextField';
import findPlayerByEmail from '../../resources/players/findPlayerByEmail';
import routesNames from '../../routes/routesNames';
import schema from './schema ';

type ClientFormData = {
  email: string;
};

const Client: React.FC = () => {
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<ClientFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const { mutate: signInAreaClientMutation, isPending } = useMutation({
    mutationFn: async ({ email }: ClientFormData) => {
      const palyer = await findPlayerByEmail(email);

      if (palyer) {
        return palyer.id;
      } else {
        throw new Error('Usuário não encontrado');
      }
    },
    onSuccess: (id: string) => {
      navigate(routesNames.VIEW_CLIENT.replace(':id', id));
    },
    onError: (e: Error) => {
      toast.error(e.message);
    },
  });

  const onSubmit: SubmitHandler<ClientFormData> = async ({ email }) => {
    signInAreaClientMutation({ email });
  };

  return (
    <Page loading={isPending}>
      <PaperGlass>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6" gutterBottom>
            Acessar Área do Cliente
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={1}>
                <Button disableElevation variant="outlined" onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />}>
                  Voltar
                </Button>
                <Button disableElevation fullWidth type="submit" variant="contained">
                  Acessar
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </PaperGlass>
    </Page>
  );
};

export default Client;
