import * as yup from 'yup';
import { formatterCurrencyBRL } from '../../../../utils/formatters';

const schema = (senderPlayerBalance: number) =>
  yup.object().shape({
    value: yup
      .number()
      .required('Campo obrigatório.')
      .positive('O valor tem que ser maior que R$ 0,00.')
      .max(
        senderPlayerBalance,
        `O valor deve ser menor ou igual a ${formatterCurrencyBRL.format(senderPlayerBalance)}.`
      ),
    description: yup.string(),
  });

export default schema;
