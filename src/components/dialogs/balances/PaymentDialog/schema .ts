import * as z from 'zod';

const schema = z.object({
  paymentValue: z.coerce.number({ required_error: 'Campo obrigatório' }),
  description: z.string(),
});

export default schema;
