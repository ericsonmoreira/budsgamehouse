import { Box, Skeleton } from '@mui/material';
import React, { ImgHTMLAttributes, useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { Card } from 'scryfall-sdk';
import NoCardImg from '../../assets/nocard.jpg';

type ImgCardProps = {
  card?: Card | null;
  isLoading: boolean;
};

const ImgCard: React.FC<ImgCardProps & ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  const { card, isLoading, ...rest } = props;

  const [isFlipped, setIsFlipped] = useState(false);

  if (!card) return null;

  if (isLoading) return <Skeleton variant="rounded" width={100} height={200} />;

  if (card.card_faces?.length > 1) {
    return (
      <Box sx={{ display: 'flex' }}>
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" infinite>
          <img
            src={card.card_faces[0].image_uris?.normal || NoCardImg}
            {...rest}
            width={100}
            onClick={() => setIsFlipped((old) => !old)}
          />
          <img
            src={card.card_faces[1].image_uris?.normal || NoCardImg}
            {...rest}
            width={100}
            onClick={() => setIsFlipped((old) => !old)}
          />
        </ReactCardFlip>
      </Box>
    );
  }

  return <img src={card.image_uris?.normal || NoCardImg} {...rest} width={100} />;
};

export default ImgCard;
