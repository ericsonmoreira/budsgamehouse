import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useTheme } from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useMemo } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import usePaymentsFromPlayer from "../../hooks/usePaymentsFromPlayer";
import useSalesFromPlayer from "../../hooks/useSalesFromPlayer";
import useTransfersFromPlayer from "../../hooks/useTransfersFromPlayer";
import PaymentInformations from "../PaymentInformations";
import SaleInformations from "../SaleInformations";
import TransferInformations from "../TransferInformations";

type PlayerActivitiesTimeLineProps = {
  data: Player;
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

const PlayerActivitiesTimeLine: React.FC<PlayerActivitiesTimeLineProps> = ({
  data,
}) => {
  const { palette, spacing } = useTheme();

  const { id } = data;

  const { data: sales } = useSalesFromPlayer(id);

  const { data: payments } = usePaymentsFromPlayer(id);

  const { data: transfers } = useTransfersFromPlayer(id);

  const getIconStyle = (obj: object): React.CSSProperties | undefined => {
    const iconRenderMap: Record<PlayerActiviteType, React.CSSProperties> = {
      payment: {
        background: palette.success.main,
        color: palette.common.white,
        borderBlockColor: palette.text.secondary,
      },
      sale: {
        background: palette.primary.main,
        color: palette.common.white,
        borderBlockColor: palette.text.secondary,
      },
      transfer: {
        background: palette.warning.main,
        color: palette.common.white,
        borderBlockColor: palette.text.secondary,
      },
    };

    const playerActiviteType = getObjectType(obj);

    return playerActiviteType ? iconRenderMap[playerActiviteType] : undefined;
  };

  const getContentStyle = (obj: object): React.CSSProperties | undefined => {
    const iconRenderMap: Record<PlayerActiviteType, React.CSSProperties> = {
      payment: {
        backgroundColor: palette.success.main,
        boxShadow: "none",
        color: palette.text.primary,
        padding: spacing(0.5),
      },
      sale: {
        backgroundColor: palette.primary.main,
        boxShadow: "none",
        color: palette.text.primary,
        padding: spacing(0.5),
      },
      transfer: {
        backgroundColor: palette.warning.main,
        boxShadow: "none",
        color: palette.text.primary,
        padding: spacing(0.5),
      },
    };

    const playerActiviteType = getObjectType(obj);

    return playerActiviteType ? iconRenderMap[playerActiviteType] : undefined;
  };

  const getContentArrowStyle = (
    obj: object,
  ): React.CSSProperties | undefined => {
    const iconRenderMap: Record<PlayerActiviteType, React.CSSProperties> = {
      payment: {
        borderRightColor: palette.success.main,
      },
      sale: {
        borderRightColor: palette.primary.main,
      },
      transfer: {
        borderRightColor: palette.warning.main,
      },
    };

    const playerActiviteType = getObjectType(obj);

    return playerActiviteType ? iconRenderMap[playerActiviteType] : undefined;
  };

  const playerActivities = useMemo<Array<Sale | Payment | Transfer>>(() => {
    if (sales && payments && transfers) {
      return [...sales, ...payments, ...transfers].sort(
        (a, b) => b.createdAt - a.createdAt,
      );
    }

    return [];
  }, [sales, payments]);

  return (
    <VerticalTimeline lineColor={palette.text.secondary} layout="1-column">
      {playerActivities.map((activite, index) => (
        <VerticalTimelineElement
          key={index}
          date={format(activite.createdAt.toDate(), "PPPp", { locale: ptBR })}
          contentArrowStyle={getContentArrowStyle(activite)}
          icon={iconRender(activite)}
          iconStyle={getIconStyle(activite)}
          contentStyle={getContentStyle(activite)}
        >
          {contentRender(activite)}
        </VerticalTimelineElement>
      ))}
    </VerticalTimeline>
  );
};

export default PlayerActivitiesTimeLine;
