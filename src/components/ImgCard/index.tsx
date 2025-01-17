import { Box, Skeleton } from "@mui/material";
import { ImgHTMLAttributes, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { Card } from "scryfall-sdk";
import NoCardImg from "@/assets/nocard.jpg";

type ImgCardProps = {
  card?: Card | null;
  isLoading: boolean;
};

function ImgCard(props: ImgCardProps & ImgHTMLAttributes<HTMLImageElement>) {
  const { card, isLoading, ...rest } = props;

  const [isFlipped, setIsFlipped] = useState(false);

  if (isLoading) return <Skeleton variant="rounded" width={100} height={200} />;

  if (!card) return null;

  if (card.card_faces?.length > 1) {
    return (
      <Box sx={{ display: "flex" }}>
        <ReactCardFlip
          isFlipped={isFlipped}
          flipDirection="horizontal"
          infinite
        >
          <img
            alt="card-image"
            src={card.card_faces[0].image_uris?.normal || NoCardImg}
            {...rest}
            width={100}
            onClick={() => setIsFlipped((old) => !old)}
          />
          <img
            alt="card-image"
            src={card.card_faces[1].image_uris?.normal || NoCardImg}
            {...rest}
            width={100}
            onClick={() => setIsFlipped((old) => !old)}
          />
        </ReactCardFlip>
      </Box>
    );
  }

  return (
    <img
      alt="image-card"
      src={card.image_uris?.normal || NoCardImg}
      {...rest}
      width={100}
    />
  );
}

export default ImgCard;
