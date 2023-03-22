import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required('Campo obrigatório'),
  format: yup.string().required('Campo obrigatório'),
  rounds: yup.string().required('Campo obrigatório').min(1),
});

export default schema;
