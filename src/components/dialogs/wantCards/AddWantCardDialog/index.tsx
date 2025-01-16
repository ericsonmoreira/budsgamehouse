import ImgCard from "@/components/ImgCard";
import SearchTextField from "@/components/textfields/SearchTextField";
import useAutoCompleteCardNames from "@/hooks/useAutoCompleteCardNames";
import useCardByName from "@/hooks/useCardByName";
import useWantedCards from "@/hooks/useWantedCards";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Grid2 as Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useDebounceCallback } from "usehooks-ts";

type AddWantCardDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & DialogProps;

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
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [cardNameSelected, setCardNameSelected] = useState<string>("");

  const [amount, setAmount] = useState("1");

  const [priority, setPriority] = useState<WantedCardPriority>("medium");

  const { addWantedCard } = useWantedCards();

  const [searchTerm, setSearchTerm] = useState("");

  const debounced = useDebounceCallback(setSearchTerm, 500);

  const { cardNames, isLoading } = useAutoCompleteCardNames(searchTerm);

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
    setCardNameSelected("");
    setOpen(false);
  };

  const handleClearSearchTerm = (): void => {
    if (inputRef.current) {
      inputRef.current.value = "";

      setSearchTerm("");
    }
  };

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subTitle}</DialogContentText>
        <Grid container spacing={1}>
          <Grid size={12}>
            <SearchTextField
              autoFocus
              inputRef={inputRef}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                debounced(event.target.value);
              }}
              handleClearSearchTerm={handleClearSearchTerm}
              placeholder="Buscar por nome..."
              size="small"
              fullWidth
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
        <Button variant="outlined" onClick={handleConfirmAction} autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddWantCardDialog;
