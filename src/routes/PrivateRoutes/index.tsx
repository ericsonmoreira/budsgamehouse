import { Outlet, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../services/firebaseConfig";
import LoadingTransition from "../../components/LoadingTransition";

const PrivateRoutes: React.FC = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <LoadingTransition />;

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
