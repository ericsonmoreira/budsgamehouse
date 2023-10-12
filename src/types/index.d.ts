declare type WantedCardPriority = 'high' | 'medium' | 'low';

declare interface Player {
  id: string;
  name: string;
  email: string;
  avatarImgUrl?: string;
  balance: number;
}

declare interface WantedCard {
  id: string;
  imgUrl: string;
  name: string;
  amount: number;
  priority: WantedCardPriority;
}

declare interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imgUrl?: string;
  stock: number;
}

declare type ItemShoppingCart = {
  amount: number;
} & Product;

declare interface PlayerActivite {
  id: string;
  playerId: string;
  type: string;
  description: string;
  date: Timestamp;
}

declare interface Sale {
  id: string;
  playerId: string;
  userId: string;
  products: {
    id: string;
    name: string;
    amount: number;
    price: number;
  }[];
  createdAt: Timestamp;
}

declare interface Payment {
  id: string;
  playerId: string;
  userId: string;
  previousPlayerBalance: number;
  currentPlayerBalance: number;
  value: number;
  description: string;
  createdAt: Timestamp;
}

type CommandStatus = 'open' | 'closed' | 'canceled';

declare interface Command {
  id: string;
  name: string;
  userId: string;
  products: {
    id: string;
    name: string;
    amount: number;
    price: number;
  }[];
  status: CommandStatus;
  createdAt: Timestamp;
}

declare interface Expense {
  id: string;
  userId: string;
  description: string;
  value: number;
  name: string;
  products: {
    id: string;
    name: string;
    amount: number;
  }[];
  createdAt: Timestamp;
}

declare interface Transfer {
  id: string;
  userId: string;
  sendingPlayerId: string;
  receiverPlayerId: string;
  value: number;
  createdAt: Timestamp;
}
