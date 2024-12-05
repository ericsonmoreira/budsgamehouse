import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import usePlayer from "../../../../hooks/usePlayer";
import AvatarPlayer from "../../../AvatarPlayer";
import SaleInformationsTable from "../../../SaleInformations";

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
    <Dialog fullScreen onClose={handleClose} {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subTitle}</DialogContentText>
        {player ? (
          <Box my={1}>
            <Stack direction="row" spacing={2} alignItems="center">
              <AvatarPlayer playerId={player.id} />
              <Typography variant="h5">{player.name}</Typography>
            </Stack>
            <Typography>Email: {player.email}</Typography>
          </Box>
        ) : (
          <Box my={1}>
            <Typography variant="h5">Venda avulsa</Typography>
          </Box>
        )}
        <SaleInformationsTable data={saleToview} />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClose}>
          Fechar
        </Button>
      </DialogActions>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading && saleToview.playerId !== ""}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </Dialog>
  );
};

export default ViewSaleDialog;
