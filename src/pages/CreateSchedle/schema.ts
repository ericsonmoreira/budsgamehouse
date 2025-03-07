import { z } from "zod";

const schema = z.object({
  title: z
    .string({ required_error: "Campo obrigatório" })
    .min(10, "Mínimo de 10 caracteres"),
  format: z.custom<MTGFormat>(),
  start: z.date({ required_error: "Campo obrigatório" }),
  price: z.coerce.number({ required_error: "Campo obrigatório" }),
});

export type SchemaData = z.infer<typeof schema>;

export default schema;
