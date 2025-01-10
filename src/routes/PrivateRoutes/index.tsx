import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, Outlet } from "react-router-dom";
import LoadingTransition from "../../components/LoadingTransition";
import { auth } from "../../services/firebaseConfig";

function PrivateRoutes() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <LoadingTransition />;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes;
