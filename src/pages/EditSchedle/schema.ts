import { z } from "zod";

const schema = z.object({
  title: z.string({ required_error: "Campo obrigatório" }),
  start: z.coerce.string({ required_error: "Campo obrigatório" }),
  price: z.coerce.number({ required_error: "Campo obrigatório" }),
  format: z.custom<MTGFormat>(),
});

export type SchemaData = z.infer<typeof schema>;

export default schema;
