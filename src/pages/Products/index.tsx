import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import DataGridProducts from '../../components/datagrids/DataGridProducts';
import AddProductDialog from '../../components/dialogs/products/AddProductDialog';
import UpdateProductDialog from '../../components/dialogs/products/UpdateProductDialog';
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
    <>
      <Box
        sx={{
          margin: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4" color="textPrimary">
          Produtos
        </Typography>
        <Tooltip title="Adicionar um novo Produto">
          <IconButton color="secondary" onClick={() => setAddProductDialogOpen(true)}>
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ margin: 1, height: 1 }}>
        <DataGridProducts
          loading={isLoading}
          rows={products?.map((product) => ({
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
        onClose={() => setAddProductDialogOpen(false)}
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
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deleteProductMutateIsloading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
};

export default Products;
