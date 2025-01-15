import ImgCard from "@/components/ImgCard";
import useAutoCompleteCardNames from "@/hooks/useAutoCompleteCardNames";
import useCardByName from "@/hooks/useCardByName";
import useDebounce from "@/hooks/useDebounce";
import useWantedCards from "@/hooks/useWantedCards";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Grid2 as Grid,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type AddWantCardDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & DialogProps;

type AddWantCardDialogFormData = {
  searchTerm: string;
};

const priorityMapValues: { value: WantedCardPriority; label: string }[] = [
  { value: "high", label: "Alto" },
  { value: "medium", label: "Médio" },
  { value: "low", label: "Baixo" },
];

function AddWantCardDialog({
  title,
  subTitle,
  setOpen,
  ...rest
}: AddWantCardDialogProps) {
  const { register, handleSubmit, watch, resetField } =
    useForm<AddWantCardDialogFormData>();

  const [cardNameSelected, setCardNameSelected] = useState<string>("");

  const [amount, setAmount] = useState("1");

  const [priority, setPriority] = useState<WantedCardPriority>("medium");

  const { addWantedCard } = useWantedCards();

  const searchTermWatch = watch("searchTerm");

  const searchTermWatchDebounce = useDebounce(searchTermWatch, 500);

  const { cardNames, isLoading } = useAutoCompleteCardNames(
    searchTermWatchDebounce,
  );

  const { card } = useCardByName(cardNameSelected);

  const { mutate: addWantedCardMutate, isPending: addWantedCardIsPending } =
    useMutation({
      mutationFn: async () => {
        if (card) {
          const imgUrl =
            (card.card_faces.length === 2
              ? card.card_faces[0].image_uris?.normal
              : card.image_uris?.normal) || "";

          addWantedCard({
            name: card.name,
            amount: Number(amount),
            imgUrl,
            priority,
          });
        }
      },
      onSuccess: () => {
        toast.success("Card adicionado com sucesso");
        resetField("searchTerm");

        setCardNameSelected("");

        setAmount("1");

        setPriority("medium");

        setOpen(false);
      },
      onError: () => {
        toast.error("Erro ao adicionar card");
      },
    });

  const handleConfirmAction = () => {
    addWantedCardMutate();
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
        <Grid container spacing={1}>
          <Grid size={12}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              slotProps={{
                input: {
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
                },
              }}
              {...register("searchTerm")}
            />
          </Grid>
          <Grid size={8}>
            <TextField
              fullWidth
              select
              size="small"
              label="Prioridade"
              variant="outlined"
              value={priority}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPriority(e.target.value as WantedCardPriority)
              }
            >
              {priorityMapValues.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              type="number"
              size="small"
              label="Quantidade"
              variant="outlined"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAmount(e.target.value)
              }
            />
          </Grid>
          <Grid size={12}>
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
          </Grid>
          <Grid
            size={12}
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <ImgCard card={card} isLoading={isLoading} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCancelAction}
        >
          Cancelar
        </Button>
        <Button
          variant="outlined"
          onClick={handleSubmit(handleConfirmAction)}
          autoFocus
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddWantCardDialog;
