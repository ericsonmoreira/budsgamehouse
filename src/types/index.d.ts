declare type WantedCardPriority = 'high' | 'medium' | 'low';

declare type Player = {
  id: string;
  name: string;
  email: string;
  avatarImgUrl?: string;
  balance: number;
};

declare type WantedCard = {
  id: string;
  imgUrl: string;
  name: string;
  amount: number;
  priority: WantedCardPriority;
};

declare type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  imgUrl?: string;
  stock: number;
};

declare type ItemShoppingCart = {
  amount: number;
} & Product;

declare type PlayerActivite = {
  id: string;
  playerId: string;
  type: string;
  description: string;
  date: Date;
};

declare type Sale = {
  id: string;
  playerId: string;
  userId: string;
  products: {
    id: string;
    name: string;
    amount: number;
  }[];
  date: Date;
};
