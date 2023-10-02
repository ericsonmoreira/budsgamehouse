import { Card, CardContent, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import React from 'react';
import { ptBR } from 'date-fns/locale';

type SaleInformationCardProps = {
  data: Sale;
};

const SaleInformationCard: React.FC<SaleInformationCardProps> = ({ data }) => {
  return (
    <Card sx={{ maxWidth: 275 }}>
      <CardContent>
        <Stack spacing={1}>
          <ul>
            {data.products.map((product) => (
              <Typography component="li" key={product.id}>
                {product.name} | {product.price} X {product.amount} = {product.price * product.amount}
              </Typography>
            ))}
          </ul>
          <Typography>{format(data.createdAt.toDate(), 'PPPPp', { locale: ptBR })}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SaleInformationCard;
