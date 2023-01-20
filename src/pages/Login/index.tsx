import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
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

  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      navigate("/");
    } catch (error) {
      console.log(error); // TODO: tratamento de erro
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          <Button
            type="submit"
            variant="outlined"
            endIcon={
              isLoading && (
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
        </Stack>
      </Container>
    </form>
  );
};

export default Login;
