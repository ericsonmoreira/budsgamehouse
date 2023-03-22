import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
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

  const [signInWithEmailAndPassword, user, loading, signError] =
    useSignInWithEmailAndPassword(auth);

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = async ({
    email,
    password,
  }) => {
    try {
      await signInWithEmailAndPassword(email, password);
    } catch (e) {
      console.log('erro');
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
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
          <ControlledTextField
            name="email"
            control={control}
            textFieldProps={{
              variant: 'outlined',
              size: 'small',
              label: 'Email',
            }}
          />
          <ControlledPasswordTextField
            name="password"
            control={control}
            textFieldProps={{
              variant: 'outlined',
              size: 'small',
              label: 'Password',
            }}
          />
          {signError && (
            <Typography sx={{ color: (theme) => theme.palette.error.dark }}>
              {verifyFirebaseErroCode(signError.code)}
            </Typography>
          )}
          <Button
            disableElevation
            type="submit"
            variant="contained"
            disabled={loading}
            endIcon={
              loading && (
                <CircularProgress
                  size={12}
                  color="info"
                  sx={{ marginLeft: 2 }}
                />
              )
            }
          >
            Login
          </Button>
          <Button
            variant="text"
            onClick={() => navigate(routesNames.RECOVER_PASSWORD)}
          >
            Redefinir senha
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default Login;
