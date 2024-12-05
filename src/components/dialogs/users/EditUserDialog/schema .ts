import { z } from "zod";

const schema = z.object({
  name: z.string({
    required_error: "Campo obrigatório",
  }),
});

export type SchemaData = z.infer<typeof schema>;

export default schema;
