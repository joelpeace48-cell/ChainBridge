export type ChainType = "stellar" | "ethereum" | "bitcoin";

export interface WalletState {
  address: string | null;
  publicKey: string | null;
  chain: ChainType | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string | null;
  error: string | null;
}

export interface WalletStore extends WalletState {
  connect: (chain: ChainType) => Promise<void>;
  disconnect: () => void;
  setBalance: (balance: string) => void;
  setError: (error: string | null) => void;
}

export interface WalletAdapter {
  connect: () => Promise<{ address: string; publicKey: string }>;
  disconnect: () => Promise<void>;
  signTransaction: (tx: any) => Promise<any>;
  getBalance: (address: string) => Promise<string>;
}
