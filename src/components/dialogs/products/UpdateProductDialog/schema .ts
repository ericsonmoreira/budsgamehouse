import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required('Campo obrigatório'),
  price: yup.number().required('Campo obrigatório').positive('O valor tem que ser mior que R$ 0,00'),
  category: yup.string().required('Campo obrigatório'),
  stock: yup.number().required('Campo obrigatório').min(0, 'Valor náo pode ser menor que 0'),
});

export default schema;
