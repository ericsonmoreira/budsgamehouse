import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import DataGridProducts from '../../components/datagrids/DataGridProducts';
import AddProductDialog from '../../components/dialogs/products/AddProductDialog';
import UpdateProductDialog from '../../components/dialogs/products/UpdateProductDialog';
import SearchTextField from '../../components/textfields/SearchTextField';
import useDebounce from '../../hooks/useDebounce';
import useProducts from '../../hooks/useProducts';
import deleteProduct from '../../resources/products/deleteProduct';

const Products: React.FC = () => {
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: products, isLoading } = useProducts();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [productToDeleteId, setProductToDeleteId] = useState('');

  const [productToUpdate, setProductToUpdate] = useState<Product>({} as Product);

  const [updateProductDialogOpen, setUpdatePproductDialogOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const searchTermDebounced = useDebounce(searchTerm, 300);

  const searchedProducts = useMemo(() => {
    if (products) {
      return products.filter(({ name }) => name.toLowerCase().includes(searchTermDebounced.toLowerCase()));
    }

    return [];
  }, [products, searchTermDebounced]);

  const handleUpdate = (product: Product) => {
    setProductToUpdate(product);

    setUpdatePproductDialogOpen(true);
  };

  const { mutate: deleteProductMutate, isLoading: deleteProductMutateIsloading } = useMutation({
    mutationFn: async () => {
      setDeleteDialogOpen(false);

      await deleteProduct(productToDeleteId);

      await queryClient.invalidateQueries(['useProducts']);
    },
    onSuccess: async () => {
      toast.success('Produto removido com sucesso');
    },
  });

  const handledelete = (id: string) => {
    setProductToDeleteId(id);

    setDeleteDialogOpen(true);
  };

  return (
    <Page loading={deleteProductMutateIsloading}>
      <PageHeader title="Produtos" onClickAddButton={() => setAddProductDialogOpen(true)} />
      <Box mx={1}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <SearchTextField
              autoFocus
              value={searchTerm}
              setValue={setSearchTerm}
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
              handledelete: () => handledelete(product.id),
              handleUpdate: () => handleUpdate(product),
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
      <Dialog fullWidth maxWidth="md" open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Remover Produto</DialogTitle>
        <DialogContent>
          <DialogContentText>Deseja realmente remover esse Produto</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => deleteProductMutate()}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default Products;
