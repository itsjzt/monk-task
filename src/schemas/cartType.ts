import { cartSchema } from "./cartSchema";
import { z } from "zod";

export type CartType = z.infer<typeof cartSchema>;
