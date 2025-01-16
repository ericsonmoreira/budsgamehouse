import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import useProduct from "@/hooks/useProduct";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Paper,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";

type ViewProductParams = {
  id: string;
};

function ViewProduct() {
  const { id } = useParams<ViewProductParams>();

  const { data, isLoading } = useProduct(id);

  return (
    <Page loading={isLoading}>
      <PageHeader title="Detalhes do Produto" containsBackButton />
      <Box px={1}>
        {data && (
          <Card sx={{ maxWidth: 345 }}>
            <CardHeader title={data.name} />
            {data.imgUrl && (
              <CardMedia
                component="img"
                height="200"
                image={data.imgUrl}
                alt="product-img"
              />
            )}
            <CardContent>
              <Typography sx={{ color: "text.secondary" }}>
                Nome: {data.name}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Categoria: {data.category}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Preço: {data.price}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Estoque: {data.stock}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Page>
  );
}

export default ViewProduct;
