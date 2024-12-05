export const formatterCurrencyBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const formatterDecimal = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
});

export const formatterPercentage = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 2,
});
