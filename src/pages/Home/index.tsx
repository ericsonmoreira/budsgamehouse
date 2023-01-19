import Button from "@mui/material/Button";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../../services/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [signOut, loading, error] = useSignOut(auth);

  const handleSignOut = async () => {
    const result = await signOut();

    console.log(result);

    navigate("login");
  };

  return (
    <div>
      <h2>Home</h2>
      <Button variant="outlined" onClick={handleSignOut}>
        Logout
      </Button>
    </div>
  );
};

export default Home;
