import { z } from "zod";

const schema = z.object({
  name: z.string({ required_error: "Campo obrigatório" }),
  amount: z.coerce
    .number({ required_error: "Campo obrigatório" })
    .min(1, "Mínimo 1"),
  imgUrl: z.string().url().optional(),
  priority: z.enum(["high", "medium", "low"]),
});

export type SchemaData = z.infer<typeof schema>;

export default schema;
