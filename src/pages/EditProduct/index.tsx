import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import ControlledCurrencyTextField from "@/components/textfields/ControlledCurrencyTextField";
import ControlledTextField from "@/components/textfields/ControlledTextField";
import useProduct from "@/hooks/useProduct";
import { SaveIcon } from "@/icons";
import updateProduct from "@/resources/products/updateProduct";
import { PRODUCT_CATEGORIES } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Grid2 as Grid, MenuItem, Paper } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import schema, { UpdateProductDialogFormData } from "./schema ";
import ImageDropZone from "@/components/ImageDropZone";
import routesNames from "@/routes/routesNames";
import uploadImageInStorage from "@/resources/uploadImageInStorage";

type EditProductParams = {
  id: string;
};

function EditProduct() {
  const { id } = useParams<EditProductParams>();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data: product, isLoading: isLoadingProduct } = useProduct(id);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProductDialogFormData>({
    resolver: zodResolver(schema),
    values: product,
  });

  const [file, setFile] = useState<File | null>();

  const {
    mutate: updateProductMutate,
    isPending: updateProductMutateIsPending,
  } = useMutation({
    mutationFn: async ({
      id,
      name,
      price,
      category,
      stock,
      imgUrl,
    }: UpdateProductDialogFormData) => {
      if (file) {
        const newImgUrl = await uploadImageInStorage(file);

        await updateProduct({
          id,
          name,
          price,
          category,
          stock,
          imgUrl: newImgUrl,
        });
      } else {
        await updateProduct({
          id,
          name,
          price,
          category,
          stock,
          imgUrl,
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["useProducts"] });
    },
    onSuccess: () => {
      navigate(routesNames.PRODUCTS);

      toast.success("Produto atualizado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSave = (data: UpdateProductDialogFormData) => {
    updateProductMutate(data);
  };

  return (
    <Page loading={updateProductMutateIsPending || isLoadingProduct}>
      <PageHeader title="Editar Produto" containsBackButton />
      {product && (
        <Box p={1} component="form" onSubmit={handleSubmit(handleSave)}>
          <Grid container spacing={2}>
            {product.imgUrl && (
              <Grid
                size={12}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <img
                  src={product.imgUrl}
                  style={{
                    display: "inline-flex",
                    width: 200,
                    height: 200,
                    boxSizing: "border-box",
                  }}
                />
              </Grid>
            )}
            <Grid size={12}>
              <ImageDropZone file={file} setFile={setFile} />
            </Grid>
            <Grid size={{ lg: 6, xs: 12 }}>
              <ControlledTextField
                name="name"
                control={control}
                variant="outlined"
                size="small"
                label="Nome do Produto"
                fullWidth
              />
            </Grid>
            <Grid size={{ lg: 6, xs: 12 }}>
              <ControlledTextField
                name="category"
                control={control}
                variant="outlined"
                size="small"
                label="Categoria"
                fullWidth
                select
              >
                {PRODUCT_CATEGORIES.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </ControlledTextField>
            </Grid>
            <Grid size={{ lg: 6, xs: 12 }}>
              <ControlledCurrencyTextField
                name="price"
                control={control}
                variant="outlined"
                size="small"
                label="Preço"
                fullWidth
              />
            </Grid>
            <Grid size={{ lg: 6, xs: 12 }}>
              <ControlledTextField
                name="stock"
                control={control}
                variant="outlined"
                size="small"
                label="Quantidade em Estoque"
                fullWidth
                type="number"
              />
            </Grid>
            <Grid size={12} justifyContent="flex-end" display="flex">
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                type="submit"
              >
                Salvar
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Page>
  );
}

export default EditProduct;
