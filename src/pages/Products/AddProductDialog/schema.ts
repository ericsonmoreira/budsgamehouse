import { z } from "zod";

const schema = z.object({
  name: z.string({ required_error: "Campo obrigatório" }),
  price: z.coerce
    .number({ required_error: "Campo obrigatório" })
    .positive("O valor tem que ser mior que R$ 0,00"),
  category: z.string({ required_error: "Campo obrigatório" }),
});

export type AddProductDialogFormData = z.infer<typeof schema>;

export default schema;
