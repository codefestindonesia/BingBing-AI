import { canisterId, idlFactory, token } from "@declarations/token";
import { createReactor } from "@ic-reactor/react"

type TokenActor = typeof token

export const {
  useQueryCall: useTokenQuery,
  useUpdateCall: useTokenUpdate,
} = createReactor<TokenActor>({
  canisterId,
  idlFactory,
  host: "http://localhost:4943",
})