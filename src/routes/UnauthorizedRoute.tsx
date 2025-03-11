import useAuthContext from "@hooks/useAuthContext";
import { Navigate } from "react-router-dom";

interface Props {
    children: React.ReactNode;
}

const UnauthorizedRoute: React.FC<Props> = ({ children }) => {
    const { user } = useAuthContext();
    if (user === undefined) return <div className="flex justify-center text-2xl font-semibold text-gray-700 animate-pulse mt-10">Loading...</div>;
    return user ? <Navigate to="/" replace /> : children;
};

export default UnauthorizedRoute;