import { formatterCurrencyBRL } from "@/utils/formatters";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  Autocomplete,
  Box,
  Button,
  Stack,
  TextField,
  type TextFieldProps,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";

type ProductWithPriority = {
  priority: number;
} & Product;

type AutocompleteProductsProps = {
  selectedProduct: Product | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  validProdutos: Product[];
  onClickAddProductButton(): void;
  disabled?: boolean;
  textFieldProps?: TextFieldProps;
};

function AutocompleteProducts({
  selectedProduct,
  setSelectedProduct,
  validProdutos,
  onClickAddProductButton,
  disabled = false,
  textFieldProps,
}: AutocompleteProductsProps) {
  const [priorities, setPriorities] = useState<Record<string, number>>({}); // mapeamento das prioridades pelo id do produto

  const validProductsSorted = useMemo<Product[]>(
    () =>
      validProdutos.sort((a, b) => {
        const aPriority = priorities[a.id] || 0;

        const bPriority = priorities[b.id] || 0;

        return bPriority - aPriority;
      }),
    [priorities, validProdutos],
  );

  return (
    <Stack direction="row" spacing={1} width={1} alignItems="center">
      <Autocomplete
        disabled={disabled}
        value={selectedProduct}
        options={validProductsSorted}
        onChange={(e, newValue) => {
          e.preventDefault();

          setSelectedProduct(newValue);

          if (newValue) {
            setPriorities((old) => ({
              ...old,
              [newValue.id]: (old[newValue.id] || 0) + 1,
            }));
          }
        }}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id}>
            {option.imgUrl && (
              <img
                src={option.imgUrl}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  marginRight: 4,
                }}
              />
            )}
            <Typography flexGrow={1}>{option.name}</Typography>
            <Typography color="GrayText">
              {formatterCurrencyBRL.format(option.price)}
            </Typography>
          </Box>
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            ref={null}
            size="small"
            label="Produtos"
            {...textFieldProps}
          />
        )}
      />
      <Button
        variant="contained"
        color="success"
        onClick={onClickAddProductButton}
        disabled={!selectedProduct}
        endIcon={<AddCircleIcon />}
        size="large"
      >
        Adicionar
      </Button>
    </Stack>
  );
}

export default AutocompleteProducts;
