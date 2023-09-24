import * as yup from 'yup';

const schema = yup.object().shape({
  playerId: yup.string().required('Campo obrigatório'),
});

export default schema;
