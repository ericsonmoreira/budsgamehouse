import { Typography, TypographyProps } from "@mui/material";
import React from "react";
import { formatterCurrencyBRL } from "../../utils/formatters";

type TypographyBalanceProps = {
  balance: number;
} & TypographyProps;

const getColor = (balenace: number) => {
  if (balenace > 0) {
    return "green";
  } else if (balenace < 0) {
    return "error";
  } else {
    return "inherit";
  }
};

const TypographyBalance: React.FC<TypographyBalanceProps> = ({
  balance,
  ...rest
}) => {
  return (
    <Typography fontWeight={700} color={getColor(balance)} {...rest}>
      {formatterCurrencyBRL.format(balance)}
    </Typography>
  );
};

export default TypographyBalance;
