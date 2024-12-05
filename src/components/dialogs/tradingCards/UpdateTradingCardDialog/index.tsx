import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import useTradingCards from "../../../../hooks/useTradingCards";
import ControlledTextField from "../../../textfields/ControlledTextField";
import schema from "./schema ";

export type TradingCardUpdateData = {
  id: string;
  name: string;
  imgUrl: string;
  amount: string;
};

type UpdateTradingCardDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tradingCardToUpdate: TradingCardUpdateData;
};

type UpdateTradingCardDialogFormData = {
  name: string;
  imgUrl: string;
  amount: string;
};

const UpdateTradingCardDialog: React.FC<
  UpdateTradingCardDialogProps & DialogProps
> = ({ title, subTitle, setOpen, tradingCardToUpdate, ...rest }) => {
  const { id, name, imgUrl, amount } = tradingCardToUpdate;

  const { updateTradingCard } = useTradingCards();

  const { control, handleSubmit, setValue } =
    useForm<UpdateTradingCardDialogFormData>({
      resolver: yupResolver(schema),
    });

  const handleConfirmAction = ({
    name,
    amount,
    imgUrl,
  }: UpdateTradingCardDialogFormData) => {
    updateTradingCard({ id, name, amount: Number(amount), imgUrl });

    toast.success("Card Atualizado com sucesso!");

    setOpen(false);
  };

  const handleCancelAction = () => {
    setOpen(false);
  };

  useEffect(() => {
    setValue("name", name);
    setValue("amount", amount);
    setValue("imgUrl", imgUrl);
  }, [tradingCardToUpdate]);

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subTitle}</DialogContentText>
        <Box
          sx={{
            display: "flex",
            marginTop: 2,
          }}
        >
          <img src={imgUrl} alt={name} style={{ width: 150 }} />
          <Stack
            spacing={2}
            sx={{
              display: "flex",
              flex: 1,
              marginLeft: 2,
            }}
          >
            <ControlledTextField
              name="name"
              control={control}
              variant="outlined"
              size="small"
              label="Nome"
              disabled
            />
            <ControlledTextField
              name="amount"
              control={control}
              variant="outlined"
              size="small"
              label="Quantidade"
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="error"
          disableElevation
          onClick={handleCancelAction}
        >
          Cancelar
        </Button>
        <Button onClick={handleSubmit(handleConfirmAction)} autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateTradingCardDialog;
