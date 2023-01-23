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
    useForm<AddWantCardDialogFormData>({});

  const [cardNameSelected, setCardNameSelected] = useState<string>("");

  const searchTermWatch = watch("searchTerm");

  const searchTermWatchDebounce = useDebounce(searchTermWatch, 500);

  const { cardNames, isLoading } = useAutoCompleteCardNames(
    searchTermWatchDebounce
  );

  const { card } = useCardByName(cardNameSelected);

  const handleConfirmAction = () => {
    resetField("searchTerm");
    setCardNameSelected("");
    setOpen(false);
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
                console.log(card);
                setCardNameSelected(name);
              }}
            />
          ))}
        </Box>
        <ImgCard card={card} isLoading={isLoading} />
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
