import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useAutoCompleteCardNames from "../../hooks/useAutoCompleteCardNames";
import useCardByName from "../../hooks/useCardByName";
import useDebounce from "../../hooks/useDebounce";
import NoCardImg from "../../assets/nocard.jpg";
import ImgCard from "../ImgCard";
import useTradingCards from "../../hooks/useTradingCards";
import { toast } from "react-hot-toast";

type AddTradingCardDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type AddTradingCardDialogFormData = {
  searchTerm: string;
};

const AddTradingCardDialog: React.FC<
  AddTradingCardDialogProps & DialogProps
> = ({ title, subTitle, setOpen, ...rest }) => {
  const { register, handleSubmit, watch, resetField } =
    useForm<AddTradingCardDialogFormData>({});

  const [cardNameSelected, setCardNameSelected] = useState<string>("");

  const [amount, setAmount] = useState("0");

  const { addTradingCard } = useTradingCards();

  const searchTermWatch = watch("searchTerm");

  const searchTermWatchDebounce = useDebounce(searchTermWatch, 500);

  const { cardNames, isLoading } = useAutoCompleteCardNames(
    searchTermWatchDebounce
  );

  const { card } = useCardByName(cardNameSelected);

  const handleConfirmAction = () => {
    try {
      if (card) {
        addTradingCard({
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
                // console.log(card);
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

export default AddTradingCardDialog;
