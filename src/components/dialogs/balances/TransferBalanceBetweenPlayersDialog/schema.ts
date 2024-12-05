import { z } from "zod";

const schema = z.object({
  value: z.coerce
    .number({
      required_error: "Campo obrigatório.",
    })
    .positive("O valor tem que ser maior que R$ 0,00."),
  description: z.string(),
});

export type SchemaData = z.infer<typeof schema>;

export default schema;
