import { z } from 'zod';

const schema = z.object({
  name: z.string({ required_error: 'Campo obrigatório' }),
  displayName: z.string().optional(),
});

export type AddCommandDialogFormData = z.infer<typeof schema>;

export default schema;
