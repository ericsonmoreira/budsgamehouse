import {
  Backdrop,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import usePlayer from '../../../../hooks/usePlayer';
import AvatarPlayer from '../../../AvatarPlayer';
import SaleInformationsTable from '../../../SaleInformationsTable';

type ViewSaleDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  saleToview: Sale;
};

const ViewSaleDialog: React.FC<ViewSaleDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  saleToview,
  ...rest
}) => {
  const { data: player, isLoading } = usePlayer(saleToview.playerId);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog fullWidth maxWidth="md" onClose={handleClose} {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subTitle}</DialogContentText>
        {player && (
          <Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <AvatarPlayer playerId={player.id} />
              <Typography variant="h5">{player.name}</Typography>
            </Stack>
            <Stack>
              <Typography>Email: {player.email}</Typography>
            </Stack>
          </Box>
        )}
        <SaleInformationsTable data={saleToview} />
      </DialogContent>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Dialog>
  );
};

export default ViewSaleDialog;
