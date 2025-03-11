import AuthContext from "@/contexts/AuthContext";
import { useContext } from "react";

function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
};

export default useAuthContext;