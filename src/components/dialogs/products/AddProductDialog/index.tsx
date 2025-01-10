import { zodResolver } from "@hookform/resolvers/zod";
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Grid,
  MenuItem,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import addProduct from "../../../../resources/products/addProduct";
import uploadImageInStorage from "../../../../resources/uploadImageInStorage";
import { PRODUCT_CATEGORIES } from "../../../../utils/constants";
import ImageDropZone from "../../../ImageDropZone";
import ControlledCurrencyTextField from "../../../textfields/ControlledCurrencyTextField";
import ControlledTextField from "../../../textfields/ControlledTextField";
import schema, { AddProductDialogFormData } from "./schema";

type AddProductDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultValues: AddProductDialogFormData = {
  name: "",
  category: PRODUCT_CATEGORIES[0],
  price: 0,
};

const AddProductDialog: React.FC<AddProductDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  ...rest
}) => {
  const { handleSubmit, reset, control } = useForm<AddProductDialogFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [file, setFile] = useState<File | null>();

  const queryClient = useQueryClient();

  const { mutate: addProductMutate, isPending: addProductMutateIsloading } =
    useMutation({
      mutationFn: async ({
        name,
        price,
        category,
      }: Omit<Product, "id" | "stock">) => {
        if (file) {
          const imgUrl = await uploadImageInStorage(file);

          await addProduct({ name, price, category, stock: 0, imgUrl });
        } else {
          await addProduct({ name, price, category, stock: 0 });
        }

        await queryClient.invalidateQueries({ queryKey: ["useProducts"] });
      },
      onSuccess: () => {
        handleClose();

        toast.success("Produto adicionado com sucesso");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });

  const handleConfirmAction = (data: AddProductDialogFormData) => {
    addProductMutate(data);
  };

  const handleClose = () => {
    setOpen(false);

    setFile(null);

    reset(defaultValues);
  };

  return (
    <Dialog fullScreen {...rest} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{subTitle}</DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ImageDropZone file={file} setFile={setFile} />
          </Grid>
          <Grid item xs={12}>
            <ControlledTextField
              name="name"
              control={control}
              variant="outlined"
              size="small"
              label="Nome do Produto"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <ControlledCurrencyTextField
              name="price"
              control={control}
              variant="outlined"
              size="small"
              label="Preço"
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit(handleConfirmAction)} autoFocus>
          Confirmar
        </Button>
      </DialogActions>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={addProductMutateIsloading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </Dialog>
  );
};

export default AddProductDialog;
