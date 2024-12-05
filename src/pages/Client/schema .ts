import { z } from "zod";

const schema = z.object({
  email: z
    .string({ required_error: "Campo obrigatório" })
    .email("Email inválido"),
});

export type SchemaData = z.infer<typeof schema>;

export default schema;
