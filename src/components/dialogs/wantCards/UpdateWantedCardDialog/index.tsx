import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  MenuItem,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import useWantedCards from "../../../../hooks/useWantedCards";
import ControlledTextField from "../../../textfields/ControlledTextField";
import schema from "./schema ";
import { zodResolver } from "@hookform/resolvers/zod";

const priorityMapValues: { value: WantedCardPriority; label: string }[] = [
  { value: "high", label: "Alto" },
  { value: "medium", label: "Médio" },
  { value: "low", label: "Baixo" },
];

export type WantedCardUpdateData = {
  id: string;
  name: string;
  imgUrl: string;
  amount: string;
  priority: WantedCardPriority;
};

type UpdateWantedCardDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tradingCardToUpdate: WantedCardUpdateData;
} & DialogProps;

type UpdateWantedCardDialogFormData = {
  name: string;
  imgUrl: string;
  amount: string;
  priority: WantedCardPriority;
};

// TODO: ajustar esse component depois
function UpdateWantedCardDialog({
  title,
  subTitle,
  setOpen,
  tradingCardToUpdate,
  ...rest
}: UpdateWantedCardDialogProps) {
  const { id, name, imgUrl, amount, priority } = tradingCardToUpdate;

  const { updateWantedCard } = useWantedCards();

  const { control, handleSubmit, setValue } =
    useForm<UpdateWantedCardDialogFormData>({
      resolver: zodResolver(schema),
    });

  const handleConfirmAction = ({
    name,
    amount,
    imgUrl,
    priority,
  }: UpdateWantedCardDialogFormData) => {
    updateWantedCard({ id, name, amount: Number(amount), imgUrl, priority });

    toast.success("Card Atualizado com sucesso!");

    setOpen(false);
  };

  const handleCancelAction = () => {
    setOpen(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setValue("name", name);
    setValue("amount", amount);
    setValue("imgUrl", imgUrl);
    setValue("priority", priority);
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
            <ControlledTextField
              name="priority"
              control={control}
              select
              variant="outlined"
              size="small"
              label="Prioridade"
            >
              {priorityMapValues.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </ControlledTextField>
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
}

export default UpdateWantedCardDialog;
