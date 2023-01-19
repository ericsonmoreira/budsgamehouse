import { TextField, Container, Button, Stack, Typography } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { useNavigate } from "react-router-dom";

type LoginFormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<LoginFormData>();

  const onSubmit: SubmitHandler<LoginFormData> = async ({
    email,
    password,
  }) => {
    await signInWithEmailAndPassword(auth, email, password);

    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Typography>Login</Typography>
          <TextField label="Email" variant="outlined" {...register("email")} />
          <TextField
            label="Senha"
            variant="outlined"
            {...register("password")}
          />
          <Button type="submit" variant="outlined">
            Sign
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default Login;
