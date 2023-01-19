import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Container,
} from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebaseConfig";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "./schema ";

type LoginFormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();

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
    await signInWithEmailAndPassword(auth, email, password);

    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container maxWidth="xl">
          <Stack spacing={2} sx={{ width: "400px" }}>
            <Typography>Login</Typography>
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
            <Button type="submit" variant="contained">
              Sign
            </Button>
          </Stack>
        </Container>
      </form>
    </Box>
  );
};

export default Login;
