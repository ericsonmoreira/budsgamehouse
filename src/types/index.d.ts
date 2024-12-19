declare type WantedCardPriority = "high" | "medium" | "low";

declare interface Player {
  id: string;
  name: string;
  email: string;
  avatarImgUrl?: string;
  phone?: string;
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
  looseValue?: number;
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

type CommandStatus = "open" | "closed" | "canceled";

declare interface Command {
  id: string;
  name: string;
  displayName?: string;
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
  description?: string;
  createdAt: Timestamp;
}

declare interface UserApp {
  id: string;
  uid: string;
  name: string;
  email: string;
}

declare type MTGFormat =
  | "Standard" // Formato rotativo para cartas mais recentes
  | "Modern" // Inclui cartas desde 8ª edição
  | "Pioneer" // Inclui cartas desde Retorno a Ravnica
  | "Legacy" // Formato eternal com banlist
  | "Vintage" // Formato eternal com restrições, permite quase todas as cartas
  | "Commander" // Formato casual com 100 cartas singleton
  | "Brawl" // Versão reduzida do Commander
  | "Pauper" // Apenas cartas comuns são permitidas
  | "Draft" // Formato limitado, com construção de deck em tempo real
  | "Sealed"; // Formato limitado, com boosters pré-abertos

declare interface Schedule {
  id: string;
  title: string;
  format: MTGFormat;
  description: string;
  start: Timestamp;
  price: number;
  createdAt: Timestamp;
}
