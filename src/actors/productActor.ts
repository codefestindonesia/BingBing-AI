import { canisterId, idlFactory, product } from "@declarations/product";
import { createReactor } from "@ic-reactor/react"

type ProductActor = typeof product

export const {
  useQueryCall: useProductQuery,
  useUpdateCall: useProductUpdate,
} = createReactor<ProductActor>({
  canisterId,
  idlFactory,
  host: "http://localhost:4943",
})