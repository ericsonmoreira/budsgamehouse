import LoadingTransition from "@/components/LoadingTransition";
import { auth } from "@/services/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoutes() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <LoadingTransition />;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes;
