import useServiceContext from "@hooks/useServiceContext";
import { useState } from "react";

export function getBalanceQuery() {
    const [balance, setBalance] = useState(0);
    const { useQueryCall: balanceQuery } = useServiceContext().tokenService;

    const { call: getBalance } = balanceQuery({
        functionName: "getBalance",
        onSuccess: (result) => {
            if (!result || 'err' in result) {
                throw new Error("Failed to get balance");
            }
            setBalance(Number(result.ok));
        },
        refetchOnMount: false,
    })
    return { balance, getBalance };
}

export function mintUpdate() {
    const { useUpdateCall: balanceUpdate } = useServiceContext().tokenService;
    const { call: mint, loading: mintLoading } = balanceUpdate({
        functionName: "mint"
    })
    return { mint, mintLoading };
}

export function transferUpdate() {
    const { useUpdateCall: balanceUpdate } = useServiceContext().tokenService;
    const { call: transfer, loading: transferLoading } = balanceUpdate({
        functionName: "transfer"
    })
    return { transfer, transferLoading };
}

export function burnUpdate() {
    const { useUpdateCall: balanceUpdate } = useServiceContext().tokenService;
    const { call: burn, loading: burnLoading } = balanceUpdate({
        functionName: "burn"
    })
    return { burn, burnLoading };
}