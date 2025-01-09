import { Typography, TypographyProps } from "@mui/material";
import React from "react";
import { formatterCurrencyBRL } from "../../utils/formatters";

type TypographyBalanceProps = {
  balance: number;
} & TypographyProps;

const getColor = (balenace: number) => {
  if (balenace > 0) {
    return "green";
  }

  if (balenace < 0) {
    return "error";
  }

  return "inherit";
};

function TypographyBalance({ balance, ...rest }: TypographyBalanceProps) {
  return (
    <Typography fontWeight={700} color={getColor(balance)} {...rest}>
      {formatterCurrencyBRL.format(balance)}
    </Typography>
  );
}

export default TypographyBalance;
