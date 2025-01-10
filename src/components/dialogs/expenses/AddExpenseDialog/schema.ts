import { z } from "zod";

const schema = z.object({
  name: z
    .string({ required_error: "Campo obrigatório." })
    .max(100, "Máximo de 100 caracteres."),
  value: z.coerce
    .number({ required_error: "Campo obrigatório." })
    .positive("O valor tem que ser mior que R$ 0,00."),
  description: z.string(),
  products: z.array(
    z.object({
      productId: z.string({ required_error: "Campo obrigatório." }),
      name: z.string({ required_error: "Campo obrigatório." }),
      amount: z.coerce
        .number({ required_error: "Campo obrigatório." })
        .min(1, "Mín. 1 unidade."),
    }),
  ),
});

export type AddExpenseDialogFormData = z.infer<typeof schema>;

export default schema;
