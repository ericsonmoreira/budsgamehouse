import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup.string().required('Campo obrigatório').email('Email inválido'),
  password: yup.string().required('Campo obrigatório'),
});

export default schema;
