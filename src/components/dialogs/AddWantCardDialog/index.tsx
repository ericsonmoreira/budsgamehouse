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
import useAutoCompleteCardNames from "../../../hooks/useAutoCompleteCardNames";
import useCardByName from "../../../hooks/useCardByName";
import useDebounce from "../../../hooks/useDebounce";
import useWantedCards from "../../../hooks/useWantedCards";
import ImgCard from "../../ImgCard";

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

  const [amount, setAmount] = useState("1");

  const { addWantedCard } = useWantedCards();

  const searchTermWatch = watch("searchTerm");

  const searchTermWatchDebounce = useDebounce(searchTermWatch, 500);

  const { cardNames, isLoading } = useAutoCompleteCardNames(
    searchTermWatchDebounce
  );

  const { card } = useCardByName(cardNameSelected);

  const handleConfirmAction = () => {
    try {
      if (card) {
        const imgUrl =
          (card.card_faces.length === 2
            ? card.card_faces[0].image_uris?.normal
            : card.image_uris?.normal) || "";

        addWantedCard({
          name: card.name,
          amount: Number(amount),
          imgUrl,
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            sx={{ marginRight: 1 }}
            variant="outlined"
            size="small"
            fullWidth
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
          <TextField
            type="number"
            size="small"
            label="Quantidade"
            variant="outlined"
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAmount(e.target.value)
            }
            inputProps={{ min: 1 }}
          />
        </Box>
        <Box sx={{ margin: 1 }}>
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <ImgCard card={card} isLoading={isLoading} />
        </Box>
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
