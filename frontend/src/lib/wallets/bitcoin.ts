import { getAddress, signTransaction } from "sats-connect";
import { WalletAdapter } from "@/types/wallet";
import config from "@/lib/config";

export class BitcoinAdapter implements WalletAdapter {
  async connect() {
    return new Promise<{ address: string; publicKey: string }>((resolve, reject) => {
      getAddress({
        payload: {
          purposes: ["ordinals", "payment"] as any,
          message: "Connect to ChainBridge",
          network: {
            type: (config.bitcoin.network === "mainnet" ? "Mainnet" : "Testnet") as any,
          },
        },
        onFinish: (response) => {
          const paymentAccount = response.addresses.find((a) => a.purpose === "payment");
          if (!paymentAccount) {
            reject(new Error("No payment address found"));
            return;
          }
          resolve({
            address: paymentAccount.address,
            publicKey: paymentAccount.publicKey,
          });
        },
        onCancel: () => reject(new Error("Connection cancelled")),
      });
    });
  }

  async disconnect() {
    // Programmatic logout not universal
  }

  async signTransaction(tx: any) {
    return new Promise((resolve, reject) => {
      signTransaction({
        payload: {
          network: {
            type: (config.bitcoin.network === "mainnet" ? "Mainnet" : "Testnet") as any,
          },
          psbtBase64: tx.psbtBase64,
          inputsToSign: tx.inputsToSign,
        } as any,
        onFinish: (response) => resolve(response),
        onCancel: () => reject(new Error("Signing cancelled")),
      });
    });
  }

  async getBalance(address: string) {
    // Bitcoin balances usually need a block explorer API (Mempool.space)
    try {
      const network = config.bitcoin.network === "mainnet" ? "" : "testnet/";
      const res = await fetch(`https://mempool.space/${network}api/address/${address}`);
      const data = await res.json();
      const satoshis = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
      return (satoshis / 100_000_000).toString();
    } catch (e) {
      console.error("Failed to fetch Bitcoin balance", e);
      return "0";
    }
  }
}
