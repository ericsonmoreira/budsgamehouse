import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddProductDialog from '../../components/dialogs/AddProductDialog';

const Products: React.FC = () => {
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);

  return (
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
        <IconButton
          color="secondary"
          onClick={() => setAddProductDialogOpen(true)}
        >
          <AddCircleIcon fontSize="large" />
        </IconButton>
      </Tooltip>
      <AddProductDialog
        title="Adicionar Produto"
        subTitle="Adiciona um novo Produto"
        open={addProductDialogOpen}
        setOpen={setAddProductDialogOpen}
        onClose={() => setAddProductDialogOpen(false)}
      />
    </Box>
  );
};

export default Products;
