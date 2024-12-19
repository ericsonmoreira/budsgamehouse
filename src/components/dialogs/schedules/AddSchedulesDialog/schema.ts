import { z } from "zod";

const schema = z.object({
  title: z.string({ required_error: "Campo obrigatório" }),
  description: z.string(),
  start: z.coerce.date(),
  // price: z.coerce.number(),
  // format: z.custom<MTGFormat>(),
});

export type SchemaData = z.infer<typeof schema>;

export default schema;
