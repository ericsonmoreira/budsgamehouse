import { Outlet, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../services/firebaseConfig";

const PrivateRoutes: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <h1>Loading.....</h1>;

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
