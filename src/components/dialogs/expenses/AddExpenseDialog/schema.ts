import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required(),
  value: yup.number().required().positive(),
  description: yup.string(),
  products: yup.array().of(
    yup.object().shape({
      id: yup.string().required(),
      name: yup.string().required(),
      amount: yup.number().required(),
    })
  ),
});

export default schema;
