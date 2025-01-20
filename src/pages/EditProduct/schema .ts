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
  file: z
    .instanceof(File)
    .optional()
    .nullable()
    .refine((file) => (file ? file.size <= 5 * 1024 * 1024 : true), {
      message: "O arquivo deve ter no máximo 5MB",
    })
    .refine(
      (file) =>
        file
          ? ["image/png", "image/jpeg", "image/webp"].includes(file.type)
          : true,
      {
        message: "O arquivo deve ser uma imagem PNG ou JPEG",
      },
    ),
});

export type UpdateProductDialogFormData = z.infer<typeof schema>;

export default schema;
