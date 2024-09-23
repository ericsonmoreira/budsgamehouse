import { zodResolver } from '@hookform/resolvers/zod';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import Page from '../../components/Page';
import PaperGlass from '../../components/PaperGlass';
import ControlledPasswordTextField from '../../components/textfields/ControlledPasswordTextField';
import ControlledTextField from '../../components/textfields/ControlledTextField';
import routesNames from '../../routes/routesNames';
import { auth } from '../../services/firebaseConfig';
import verifyFirebaseErroCode from '../../services/verifyFirebaseErroCode';
import schema, { SchemaData } from './schema ';

function Login() {
  const navigate = useNavigate();

  const [signInWithEmailAndPassword, user, loading, signError] = useSignInWithEmailAndPassword(auth);

  const { control, handleSubmit } = useForm<SchemaData>({
    resolver: zodResolver(schema),
  });

  const { mutate: signInWithEmailAndPasswordMutation } = useMutation({
    mutationFn: async ({ email, password }: SchemaData) => {
      await signInWithEmailAndPassword(email, password);
    },
    onSuccess: () => {
      navigate(routesNames.HOME);
    },
  });

  const onSubmit: SubmitHandler<SchemaData> = async ({ email, password }) => {
    signInWithEmailAndPasswordMutation({ email, password });
  };

  if (user) {
    return <Navigate to={routesNames.HOME} />;
  }

  return (
    <Page loading={loading}>
      <PaperGlass>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6" gutterBottom>
            Login
          </Typography>
          <Stack direction="column" spacing={1}>
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
            <ControlledPasswordTextField
              name="password"
              control={control}
              variant="outlined"
              size="small"
              label="Password"
              fullWidth
            />
            {signError && (
              <Typography sx={{ color: (theme) => theme.palette.error.dark }}>
                {verifyFirebaseErroCode(signError.code)}
              </Typography>
            )}
            <Button disableElevation fullWidth type="submit" variant="contained" endIcon={<LoginIcon />}>
              Login
            </Button>
          </Stack>
        </form>
        <Grid container mt={1} spacing={1}>
          <Grid item xs={12} sm={6}>
            <Button variant="outlined" fullWidth onClick={() => navigate(routesNames.RECOVER_PASSWORD)}>
              Redefinir senha
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                navigate(routesNames.CLIENT);
              }}
              endIcon={<PersonIcon />}
            >
              Área do Cliente
            </Button>
          </Grid>
        </Grid>
      </PaperGlass>
    </Page>
  );
}

export default Login;
