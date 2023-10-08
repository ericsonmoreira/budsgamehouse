import * as yup from 'yup';

const schema = yup.object().shape({
  paymentValue: yup.number().required('Campo obrigatório'),
  description: yup.string(),
});

export default schema;
