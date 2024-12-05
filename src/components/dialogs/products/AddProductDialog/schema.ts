import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Campo obrigatório"),
  price: yup
    .number()
    .required("Campo obrigatório")
    .positive("O valor tem que ser mior que R$ 0,00"),
  category: yup.string().required("Campo obrigatório"),
});

export default schema;
