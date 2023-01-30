import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import useAutoCompleteCardNames from "../../hooks/useAutoCompleteCardNames";
import useCardByName from "../../hooks/useCardByName";
import useDebounce from "../../hooks/useDebounce";
import useWantedCards from "../../hooks/useWantedCards";
import ImgCard from "../ImgCard";

type AddWantCardDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type AddWantCardDialogFormData = {
  searchTerm: string;
};

const AddWantCardDialog: React.FC<AddWantCardDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  ...rest
}) => {
  const { register, handleSubmit, watch, resetField } =
    useForm<AddWantCardDialogFormData>();

  const [cardNameSelected, setCardNameSelected] = useState<string>("");

  const [amount, setAmount] = useState("0");

  const { addWantedCard } = useWantedCards();

  const searchTermWatch = watch("searchTerm");

  const searchTermWatchDebounce = useDebounce(searchTermWatch, 500);

  const { cardNames, isLoading } = useAutoCompleteCardNames(
    searchTermWatchDebounce
  );

  const { card } = useCardByName(cardNameSelected);

  // TODO: acho que nem precisavamos usar o useForm pra salvar esses dados
  // Mas possivelmente veveremos fazer um tratamento antes de enviar os dados
  // E possivelmente deve ficar mais fácil com ele usando validação com o yup
  const handleConfirmAction = () => {
    try {
      if (card) {
        addWantedCard({
          name: card.name,
          amount: Number(amount),
          imgUrl: card.image_uris?.normal || "",
        });

        toast.success("Card adicionado com sucesso");
      }
    } catch (error) {
      console.log(error);
    } finally {
      resetField("searchTerm");
      setCardNameSelected("");
      setAmount("1");
      setOpen(false);
    }
  };

  const handleCancelAction = () => {
    resetField("searchTerm");
    setCardNameSelected("");
    setOpen(false);
  };

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subTitle}</DialogContentText>
        <TextField
          variant="standard"
          fullWidth
          sx={{ marginY: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {isLoading && <CircularProgress size={16} />}
              </InputAdornment>
            ),
          }}
          {...register("searchTerm")}
        />
        <Box>
          {cardNames?.map((name) => (
            <Chip
              sx={{ marginLeft: 0.5, marginBottom: 0.5 }}
              key={name}
              label={name}
              onClick={() => {
                setCardNameSelected(name);
              }}
            />
          ))}
        </Box>
        <ImgCard card={card} isLoading={isLoading} />
        <TextField
          type="number"
          label="Quantidade"
          variant="outlined"
          value={amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAmount(e.target.value)
          }
          inputProps={{ min: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelAction}>Cancelar</Button>
        <Button onClick={handleSubmit(handleConfirmAction)} autoFocus>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWantCardDialog;
