import { z } from "zod";

const schema = z.object({
  id: z.string(),
  name: z.string({ required_error: "Campo obrigatório" }),
  phone: z.string().optional(),
  email: z
    .string({ required_error: "Campo obrigatório" })
    .email("Email inválido"),
  avatarImgUrl: z.string().optional(),
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
  balance: z.number(),
});

export type EditPlayerDialogFormData = z.infer<typeof schema>;

export default schema;

// id: string;
// name: string;
// email: string;
// avatarImgUrl?: string;
// phone?: string;
// balance: number;
