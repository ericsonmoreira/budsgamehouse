import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { auth } from "../../services/firebaseConfig";
import verifyFirebaseErroCode from "../../services/verifyFirebaseErroCode";
import schema from "./schema ";

type LoginFormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const [signInWithEmailAndPassword, user, loading, signError] =
    useSignInWithEmailAndPassword(auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = async ({
    email,
    password,
  }) => {
    try {
      await signInWithEmailAndPassword(email, password);
    } catch (e) {
      console.log("erro");
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2,
        width: "100%",
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(5px)",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          spacing={2}
          sx={{
            display: "flex",
            flex: 1,
          }}
        >
          <Typography variant="h4">Login ATM</Typography>
          <TextField
            label="Email"
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email")}
          />
          <TextField
            label="Senha"
            variant="outlined"
            error={!!errors.password}
            helperText={errors.password?.message}
            type="password"
            autoComplete="current-password"
            {...register("password")}
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
          <Button>Redefinir senha</Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default Login;
