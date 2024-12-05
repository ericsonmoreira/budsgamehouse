import { z } from "zod";

const schema = z.object({
  looseValue: z.coerce.number().min(0),
});

export type SchemaData = z.infer<typeof schema>;

export default schema;
