import { z } from "zod";

const schema = z.object({
  id: z.string(),
  title: z
    .string({ required_error: "Campo obrigatório" })
    .min(10, "Mínimo de 10 caracteres"),
  format: z.custom<MTGFormat>(),
  description: z.string({ required_error: "Campo obrigatório" }),
  start: z.date({ required_error: "Campo obrigatório" }),
  price: z.coerce.number({ required_error: "Campo obrigatório" }),
  createdAt: z.date(),
});

export type SchemaData = z.infer<typeof schema>;

export default schema;
