import SearchIcon from '@mui/icons-material/Search';
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
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useAutoCompleteCardNames from '../../../hooks/useAutoCompleteCardNames';
import useCardByName from '../../../hooks/useCardByName';
import useDebounce from '../../../hooks/useDebounce';
import useWantedCards from '../../../hooks/useWantedCards';
import ImgCard from '../../ImgCard';

type AddWantCardDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type AddWantCardDialogFormData = {
  searchTerm: string;
};

const priorityMapValues: { value: WantedCardPriority; label: string }[] = [
  { value: 'high', label: 'Alto' },
  { value: 'medium', label: 'Médio' },
  { value: 'low', label: 'Baixo' },
];

const AddWantCardDialog: React.FC<AddWantCardDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  ...rest
}) => {
  const { register, handleSubmit, watch, resetField } =
    useForm<AddWantCardDialogFormData>();

  const [cardNameSelected, setCardNameSelected] = useState<string>('');

  const [amount, setAmount] = useState('1');

  const [priority, setPriority] = useState<WantedCardPriority>('medium');

  const { addWantedCard } = useWantedCards();

  const searchTermWatch = watch('searchTerm');

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
            : card.image_uris?.normal) || '';

        addWantedCard({
          name: card.name,
          amount: Number(amount),
          imgUrl,
          priority,
        });

        toast.success('Card adicionado com sucesso');
      }
    } catch (error) {
      console.log(error);
    } finally {
      resetField('searchTerm');
      setCardNameSelected('');
      setAmount('1');
      setPriority('medium');
      setOpen(false);
    }
  };

  const handleCancelAction = () => {
    resetField('searchTerm');
    setCardNameSelected('');
    setOpen(false);
  };

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subTitle}</DialogContentText>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
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
              {...register('searchTerm')}
            />
          </Grid>
          <Grid item xs={8}>
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
          <Grid item xs={4}>
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
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
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
            item
            xs={12}
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <ImgCard card={card} isLoading={isLoading} />
          </Grid>
        </Grid>
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
