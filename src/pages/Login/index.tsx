import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import Page from '../../components/Page';
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
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          width: '100%',
          background: 'rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(5px)',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            spacing={2}
            sx={{
              display: 'flex',
              flex: 1,
            }}
          >
            <Typography variant="h6">Login ATM</Typography>
            <ControlledTextField name="email" control={control} variant="outlined" size="small" label="Email" />
            <ControlledPasswordTextField
              name="password"
              control={control}
              variant="outlined"
              size="small"
              label="Password"
            />
            {signError && (
              <Typography sx={{ color: (theme) => theme.palette.error.dark }}>
                {verifyFirebaseErroCode(signError.code)}
              </Typography>
            )}
            <Button disableElevation type="submit" variant="contained">
              Login
            </Button>
          </Stack>
        </form>
        <Button variant="text" onClick={() => navigate(routesNames.RECOVER_PASSWORD)}>
          Redefinir senha
        </Button>
      </Paper>
    </Page>
  );
};

export default Login;
