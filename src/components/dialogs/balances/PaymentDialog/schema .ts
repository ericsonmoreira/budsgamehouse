import * as yup from 'yup';

const schema = yup.object().shape({
  paymentValue: yup
    .number()
    .required('Campo obrigatório')
    .positive('O valor do pagamento tem que ser maior que R$ 0,00'),
  description: yup.string(),
});

export default schema;
