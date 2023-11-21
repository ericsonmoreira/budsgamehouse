import * as yup from 'yup';

const schema = yup.object().shape({
  looseValue: yup.number().min(0),
});

export default schema;
