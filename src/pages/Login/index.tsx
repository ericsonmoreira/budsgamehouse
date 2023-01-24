import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebaseConfig";
import schema from "./schema ";

type LoginFormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [signInWithEmailAndPassword, user, loading, error] =
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

      navigate("/");
    } catch (error) {
      console.log(error); // TODO: tratamento de erro
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ width: "400px" }}>
        <Typography>Login ATM</Typography>
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
        <Button
          type="submit"
          variant="outlined"
          disabled={loading}
          endIcon={
            loading && (
              <CircularProgress size={12} color="info" sx={{ marginLeft: 2 }} />
            )
          }
        >
          Login
        </Button>
      </Stack>
    </form>
  );
};

export default Login;
