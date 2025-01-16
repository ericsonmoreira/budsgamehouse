import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import DataGridProducts from "@/components/datagrids/DataGridProducts";
import AddProductDialog from "@/components/dialogs/products/AddProductDialog";
import UpdateProductDialog from "@/components/dialogs/products/UpdateProductDialog";
import SearchTextField from "@/components/textfields/SearchTextField";
import useConfirmation from "@/hooks/useConfirmation";
import useProducts from "@/hooks/useProducts";
import deleteProduct from "@/resources/products/deleteProduct";
import { Box, Grid2 as Grid } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useDebounceCallback } from "usehooks-ts";

function Products() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [searchParams, setSearchParams] = useSearchParams({ searchTerm: "" });

  const searchTerm = searchParams.get("searchTerm");

  const { showDialog, confirmationDialog: ConfirmationDialog } =
    useConfirmation();

  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: products, isLoading } = useProducts();

  const [productToUpdate, setProductToUpdate] = useState<Product>(
    {} as Product,
  );

  const [updateProductDialogOpen, setUpdatePproductDialogOpen] =
    useState(false);

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
    setProductToUpdate(product);

    setUpdatePproductDialogOpen(true);
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
      <UpdateProductDialog
        productToUpdate={productToUpdate}
        title="Atualizar Produto"
        subTitle="Atualiza um Produto"
        open={updateProductDialogOpen}
        setOpen={setUpdatePproductDialogOpen}
        onClose={() => setUpdatePproductDialogOpen(false)}
      />
      <ConfirmationDialog />
    </Page>
  );
}

export default Products;
