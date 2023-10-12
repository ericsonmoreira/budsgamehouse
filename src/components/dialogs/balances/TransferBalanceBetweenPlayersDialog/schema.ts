import * as yup from 'yup';

const schema = yup.object().shape({
  value: yup.number().required('Campo obrigatório.').positive('O valor tem que ser maior que R$ 0,00.'),
});

export default schema;
