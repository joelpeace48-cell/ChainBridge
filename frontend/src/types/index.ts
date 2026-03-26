export interface Swap {
  id: string;
  initiator: string;
  responder: string;
  inputAsset: string;
  outputAsset: string;
  inputAmount: string;
  outputAmount: string;
  hashlock: string;
  timelock: number;
  status: SwapStatus;
  createdAt: string;
  updatedAt: string;
}

export enum SwapStatus {
  PENDING = "pending",
  LOCKED_INITIATOR = "locked_initiator",
  LOCKED_RESPONDER = "locked_responder",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}

export interface CreateSwapRequest {
  inputAsset: string;
  outputAsset: string;
  inputAmount: string;
  outputAmount: string;
  responder?: string;
}

export interface WalletInfo {
  address: string;
  chain: string;
  balance: string;
}

export enum TransactionStatus {
  PENDING = "pending",
  CONFIRMING = "confirming",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface Transaction {
  id: string;
  hash: string;
  chain: string;
  type: "inbound" | "outbound" | "swap_lock" | "swap_redeem";
  amount: string;
  token: string;
  status: TransactionStatus;
  confirmations: number;
  requiredConfirmations: number;
  timestamp: string;
  counterparty?: string;
  proofVerified?: boolean;
}

export interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
}

export enum OrderSide {
  BUY = "buy",
  SELL = "sell",
}

export enum OrderStatus {
  OPEN = "open",
  FILLED = "filled",
  CANCELLED = "cancelled",
}

export interface Order {
  id: string;
  maker: string;
  pair: string; // e.g., "XLM/ETH"
  side: OrderSide;
  amount: string;
  price: string;
  total: string;
  tokenIn: string;
  tokenOut: string;
  chainIn: string;
  chainOut: string;
  status: OrderStatus;
  timestamp: string;
}

export interface OrderBookStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  removeOrder: (id: string) => void;
}
