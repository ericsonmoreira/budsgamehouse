import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Campo obrigatório"),
  amount: yup.number().required("Campo obrigatório").min(1, "Mínimo 1"),
});

export default schema;
