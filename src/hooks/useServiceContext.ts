import ServiceContext from "@/contexts/ServiceContext";
import { useContext } from "react";

function useServiceContext() {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useServiceContext must be used within Service Provider');
    }
    return context;
};

export default useServiceContext;