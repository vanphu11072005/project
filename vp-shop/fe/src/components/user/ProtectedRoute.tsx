import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../hooks";

type Props = {
  children: React.ReactNode;
  role: "user" | "admin";
};

export const ProtectedRoute = ({ children, role }: Props) => {
  const { token, user } = useAppSelector((state) => state.auth);
  // const { token: adminToken, admin } = useAppSelector((state) => state.adminAuth);

  if (role === "user") {
    if (!token || !user) {
      return <Navigate to="/login" replace />;
    }
    if (user.role !== "customer") {
      return <Navigate to="/login" replace />;
    }
  }

  // if (role === "admin") {
  //   if (!adminToken || !admin) {
  //     return <Navigate to="/admin/login" replace />;
  //   }
  //   if (admin.role !== "admin") {
  //     return <Navigate to="/admin/login" replace />;
  //   }
  // }

  return <>{children}</>;
};
