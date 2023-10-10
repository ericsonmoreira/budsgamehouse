import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Typography } from '@mui/material';
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
import schema from './schema ';

type LoginFormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [signInWithEmailAndPassword, user, loading, signError] = useSignInWithEmailAndPassword(auth);

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const { mutate: signInWithEmailAndPasswordMutation } = useMutation({
    mutationFn: async ({ email, password }: LoginFormData) => {
      await signInWithEmailAndPassword(email, password);
    },
    onSuccess: () => {
      navigate(routesNames.HOME);
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async ({ email, password }) => {
    signInWithEmailAndPasswordMutation({ email, password });
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Page loading={loading}>
      <PaperGlass>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6" gutterBottom>
            Login
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <ControlledTextField
                autoFocus
                name="email"
                control={control}
                variant="outlined"
                size="small"
                label="Email"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
              <Button disableElevation fullWidth type="submit" variant="contained">
                Login
              </Button>
            </Grid>
          </Grid>
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
            >
              Área do Cliente
            </Button>
          </Grid>
        </Grid>
      </PaperGlass>
    </Page>
  );
};

export default Login;
