import * as yup from 'yup';

const schema = yup.object().shape({
  title: yup.string().required('Campo obrigatório'),
  description: yup.string(),
  start: yup.date(),
  end: yup.date(),
});

export default schema;
