import * as yup from "yup";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Campo obrigatório.")
    .max(100, "Máximo de 100 caracteres."),
  value: yup
    .number()
    .required("Campo obrigatório.")
    .positive("O valor tem que ser mior que R$ 0,00."),
  description: yup.string(),
  products: yup.array().of(
    yup.object().shape({
      productId: yup.string().required("Campo obrigatório."),
      name: yup.string().required("Campo obrigatório."),
      amount: yup
        .number()
        .required("Campo obrigatório.")
        .min(1, "Mín. 1 unidade."),
    }),
  ),
});

export default schema;
