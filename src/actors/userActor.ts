import { canisterId, idlFactory, user } from "@declarations/user";
import { createReactor } from "@ic-reactor/react"

type UserActor = typeof user

export const {
    useQueryCall: useUserQuery,
    useUpdateCall: useUserUpdate,
    useMethod: useUserMethod,
} = createReactor<UserActor>({
    canisterId,
    idlFactory,
    host: "http://localhost:4943",
})