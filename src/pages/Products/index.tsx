import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import SearchTextField from "@/components/textfields/SearchTextField";
import useConfirmation from "@/hooks/useConfirmation";
import useProducts from "@/hooks/useProducts";
import deleteProduct from "@/resources/products/deleteProduct";
import routesNames from "@/routes/routesNames";
import { Box, Grid2 as Grid } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounceCallback } from "usehooks-ts";
import AddProductDialog from "./AddProductDialog";
import DataGridProducts from "./DataGridProducts";

function Products() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams({ searchTerm: "" });

  const searchTerm = searchParams.get("searchTerm");

  const { showDialog, confirmationDialog: ConfirmationDialog } =
    useConfirmation();

  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: products, isLoading } = useProducts();

  const debounced = useDebounceCallback((value: string) => {
    setSearchParams({ searchTerm: value });
  }, 500);

  const searchedProducts = useMemo(() => {
    if (products) {
      return products.filter(({ name }) =>
        name.toLowerCase().includes(searchTerm?.toLowerCase() || ""),
      );
    }

    return [];
  }, [products, searchTerm]);

  const handleUpdate = (product: Product) => {
    navigate(routesNames.EDIT_PRODUCT.replace(":id", product.id));
  };

  const {
    mutate: deleteProductMutate,
    isPending: deleteProductMutateIsloading,
  } = useMutation({
    mutationFn: async (product: Product) => {
      await deleteProduct(product.id);

      await queryClient.invalidateQueries({ queryKey: ["useProducts"] });
    },
    onSuccess: async (data, variables) => {
      toast.success(`Produto ${variables.name} removido com sucesso`);
    },
  });

  const handledelete = async (product: Product) => {
    const confirmation = await showDialog({
      title: "Remover Produto",
      message: `Deseja realmente remover o Produto ${product.name}?`,
    });

    if (confirmation) {
      deleteProductMutate(product);
    }
  };

  const handleClearSearchTerm = (): void => {
    if (inputRef.current) {
      inputRef.current.value = "";

      setSearchParams({ searchTerm: "" });
    }
  };

  return (
    <Page loading={deleteProductMutateIsloading}>
      <PageHeader
        title="Produtos"
        onClickAddButton={() => setAddProductDialogOpen(true)}
      />
      <Box mx={1}>
        <Grid container spacing={1}>
          <Grid size={12}>
            <SearchTextField
              autoFocus
              inputRef={inputRef}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                debounced(event.target.value);
              }}
              handleClearSearchTerm={handleClearSearchTerm}
              placeholder="Buscar por nome..."
              size="small"
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ margin: 1, height: 1 }}>
        <DataGridProducts
          loading={isLoading}
          rows={searchedProducts.map((product) => ({
            ...product,
            actions: {
              handleUpdate: () => handleUpdate(product),
              handledelete: () => handledelete(product),
            },
          }))}
        />
      </Box>
      <AddProductDialog
        title="Adicionar Produto"
        subTitle="Adiciona um novo Produto"
        open={addProductDialogOpen}
        setOpen={setAddProductDialogOpen}
      />
      <ConfirmationDialog />
    </Page>
  );
}

export default Products;
