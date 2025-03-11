import useAuthContext from "@hooks/useAuthContext";
import useServiceContext from "@hooks/useServiceContext";
import { Navigate } from "react-router-dom";

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const { user } = useAuthContext();
    if (user === undefined) return <div className="flex justify-center text-2xl font-semibold text-gray-700 animate-pulse mt-10">Loading...</div>;
    return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;