import { z } from 'zod';

const schema = z.object({
  name: z.string({ required_error: 'Campo obrigatório' }),
  phone: z.string(),
  email: z.string({ required_error: 'Campo obrigatório' }).email('Email inválido'),
});

export type AddPlayerDialogFormData = z.infer<typeof schema>;

export default schema;
