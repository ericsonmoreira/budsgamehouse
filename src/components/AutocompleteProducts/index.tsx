import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Autocomplete, Box, IconButton, Stack, TextField, Typography } from '@mui/material';

import React from 'react';
import { formatterCurrencyBRL } from '../../utils/formatters';

type AutocompleteProductsProps = {
  selectedProduct: Product | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  validProdutos: Product[];
  onClickAddProductButton(): void;
  disabled?: boolean;
};

const AutocompleteProducts: React.FC<AutocompleteProductsProps> = ({
  selectedProduct,
  setSelectedProduct,
  validProdutos,
  onClickAddProductButton,
  disabled = false,
}) => {
  return (
    <Stack direction="row" spacing={1} width={1}>
      <Autocomplete
        disabled={disabled}
        value={selectedProduct}
        options={validProdutos}
        onChange={(_, newValue) => {
          setSelectedProduct(newValue);
        }}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            {option.imgUrl && (
              <img src={option.imgUrl} style={{ width: 20, height: 20, borderRadius: '50%', marginRight: 4 }} />
            )}
            <Typography flexGrow={1}>{option.name}</Typography>
            <Typography color="GrayText">{formatterCurrencyBRL.format(option.price)}</Typography>
          </Box>
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        fullWidth
        renderInput={(params) => <TextField {...params} ref={null} size="small" label="Produtos" />}
      />
      <IconButton color="success" disabled={!selectedProduct} onClick={onClickAddProductButton}>
        <AddCircleIcon />
      </IconButton>
    </Stack>
  );
};

export default AutocompleteProducts;
