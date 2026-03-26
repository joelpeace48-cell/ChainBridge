import { ChainType, WalletAdapter } from "@/types/wallet";
import { StellarAdapter } from "./stellar";
import { EthereumAdapter } from "./ethereum";
import { BitcoinAdapter } from "./bitcoin";

const adapters: Record<ChainType, WalletAdapter> = {
  stellar: new StellarAdapter(),
  ethereum: new EthereumAdapter(),
  bitcoin: new BitcoinAdapter(),
};

export function getAdapter(chain: ChainType): WalletAdapter {
  const adapter = adapters[chain];
  if (!adapter) {
    throw new Error(`Unsupported chain: ${chain}`);
  }
  return adapter;
}
