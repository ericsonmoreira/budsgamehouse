import { z } from "zod";

const schema = z.object({
  id: z.string({ required_error: "Campo obrigatório" }),
  name: z.string({ required_error: "Campo obrigatório" }),
  price: z.coerce
    .number({ required_error: "Campo obrigatório" })
    .positive("O valor tem que ser mior que R$ 0,00"),
  category: z.string({ required_error: "Campo obrigatório" }),
  stock: z.coerce
    .number({ required_error: "Campo obrigatório" })
    .min(0, "Valor náo pode ser menor que 0"),
  imgUrl: z.string().optional(),
});

export type UpdateProductDialogFormData = z.infer<typeof schema>;

export default schema;
