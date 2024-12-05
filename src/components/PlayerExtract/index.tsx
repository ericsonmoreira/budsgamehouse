import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useCallback, useMemo, useState } from "react";
import usePaymentsFromPlayer from "../../hooks/usePaymentsFromPlayer";
import useSalesFromPlayer from "../../hooks/useSalesFromPlayer";
import useTransfersFromPlayer from "../../hooks/useTransfersFromPlayer";
import PaymentInformations from "../PaymentInformations";
import SaleInformations from "../SaleInformations";
import TransferInformations from "../TransferInformations";
import TypographyBalance from "../TypographyBalance";

type PlayerExtractProps = {
  player: Player;
};

type PlayerActiviteType = "sale" | "payment" | "transfer";

const isSale = (obj: object): boolean => {
  return "products" in obj;
};

const isPayment = (obj: object): boolean => {
  return "previousPlayerBalance" in obj || "currentPlayerBalance" in obj;
};

const isTransfer = (obj: object): boolean => {
  return "sendingPlayerId" in obj && "receiverPlayerId" in obj;
};

const getObjectType = (obj: object): PlayerActiviteType | undefined => {
  if (isSale(obj)) {
    return "sale";
  } else if (isPayment(obj)) {
    return "payment";
  } else if (isTransfer(obj)) {
    return "transfer";
  }
};

const iconRender = (obj: object) => {
  const iconRenderMap: Record<PlayerActiviteType, React.ReactNode> = {
    payment: <AttachMoneyIcon />,
    sale: <ShoppingCartIcon />,
    transfer: <SwapHorizIcon />,
  };

  const playerActiviteType = getObjectType(obj);

  return playerActiviteType ? (
    iconRenderMap[playerActiviteType]
  ) : (
    <QuestionMarkIcon />
  );
};

const getObjectTypeName = (obj: object) => {
  const typeNameMap: Record<PlayerActiviteType, string> = {
    payment: "Pagamento",
    sale: "Compra",
    transfer: "Transferência",
  };

  const playerActiviteType = getObjectType(obj);

  return playerActiviteType ? typeNameMap[playerActiviteType] : "Outro";
};

const contentRender = (obj: object) => {
  const iconRenderMap: Record<PlayerActiviteType, React.ReactNode> = {
    payment: <PaymentInformations data={obj as Payment} />,
    sale: <SaleInformations data={obj as Sale} />,
    transfer: <TransferInformations data={obj as Transfer} />,
  };

  const playerActiviteType = getObjectType(obj);

  return playerActiviteType ? (
    iconRenderMap[playerActiviteType]
  ) : (
    <QuestionMarkIcon />
  );
};

const PlayerExtract: React.FC<PlayerExtractProps> = ({ player }) => {
  const { id } = player;

  const [openDialog, setOpenDialog] = useState(false);

  const { data: sales, isLoading: salesIsLoading } = useSalesFromPlayer(id);

  const { data: payments, isLoading: paymentsIsLoading } =
    usePaymentsFromPlayer(id);

  const { data: transfers, isLoading: transfersIsLoading } =
    useTransfersFromPlayer(id);

  const [selectedActive, setSelectedActive] = useState<object | null>(null);

  const handleViewActivite = useCallback(
    (obj: object) => {
      setSelectedActive(obj);

      setOpenDialog(true);
    },
    [setSelectedActive, setOpenDialog],
  );

  const handleClose = useCallback(() => {
    setOpenDialog(false);

    setSelectedActive(null);
  }, [setSelectedActive, setOpenDialog]);

  const isLoading = useMemo(
    () => salesIsLoading || paymentsIsLoading || transfersIsLoading,
    [salesIsLoading, paymentsIsLoading, transfersIsLoading],
  );

  const playerActivities = useMemo<Array<Sale | Payment | Transfer>>(() => {
    if (sales && payments && transfers) {
      return [...sales, ...payments, ...transfers].sort(
        (a, b) => b.createdAt - a.createdAt,
      );
    }

    return [];
  }, [sales, payments]);

  const getObjectTypeBalance = useCallback(
    (obj: object): number => {
      const balanceMap: Record<PlayerActiviteType, (obj: object) => number> = {
        payment: (obj: object) => {
          const activite = obj as Payment;

          return activite.value;
        },
        sale: (obj: object) => {
          const activite = obj as Sale;

          return (
            -activite.products.reduce(
              (acc, curr) => acc + curr.price * curr.amount,
              0,
            ) - (activite?.looseValue || 0)
          );
        },
        transfer: (obj: object) => {
          const activite = obj as Transfer;

          return id === activite.receiverPlayerId
            ? activite.value
            : -activite.value;
        },
      };

      const playerActiviteType = getObjectType(obj);

      return playerActiviteType ? balanceMap[playerActiviteType](obj) : 0;
    },
    [id],
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Typography variant="h6" color="GrayText" gutterBottom>
        Extrato
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width={50}>Data</TableCell>
              <TableCell width={100}>Tipo</TableCell>
              <TableCell align="right">R$</TableCell>
              <TableCell width={24} align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {playerActivities &&
              playerActivities.map((activite) => (
                <TableRow key={activite.id}>
                  <TableCell>
                    {format(activite.createdAt.toDate(), "dd/LL", {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography color="primary" variant="inherit">
                        {iconRender(activite)}
                      </Typography>
                      <Typography color="primary" variant="inherit">
                        {getObjectTypeName(activite)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <TypographyBalance
                      variant="inherit"
                      balance={getObjectTypeBalance(activite)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleViewActivite(activite)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog fullScreen open={openDialog} onClose={handleClose}>
        <DialogTitle>Detalhamento</DialogTitle>
        {selectedActive && (
          <DialogContent>{contentRender(selectedActive)}</DialogContent>
        )}
        <DialogActions>
          <Button color="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PlayerExtract;
