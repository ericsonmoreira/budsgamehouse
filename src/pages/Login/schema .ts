import { z } from "zod";

const schema = z.object({
  email: z
    .string({
      required_error: "Campo obrigatório",
    })
    .email("Email inválido"),
  password: z.string({ required_error: "Campo obrigatório" }),
});

export type SchemaData = z.infer<typeof schema>;

export default schema;
