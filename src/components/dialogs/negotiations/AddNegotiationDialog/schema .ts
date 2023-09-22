import * as yup from 'yup';

const schema = yup.object().shape({
  description: yup.string().required('Campo obrigatório'),
});

export default schema;
