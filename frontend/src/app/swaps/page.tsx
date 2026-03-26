"use client";

import { Card, Badge, Button, LoadingState } from "@/components/ui";
import { History, ExternalLink, ArrowRight, Filter } from "lucide-react";
import { SwapStatus } from "@/types";
import { useWalletStore } from "@/hooks/useWallet";

const MOCK_SWAPS = [
  {
    id: "swap_001",
    from: "XLM",
    to: "BTC",
    amount: "5,000",
    toAmount: "0.009",
    status: SwapStatus.COMPLETED,
    date: "2024-03-20T10:00:00Z",
  },
  {
    id: "swap_002",
    from: "ETH",
    to: "XLM",
    amount: "1.2",
    toAmount: "12,500",
    status: SwapStatus.PENDING,
    date: "2024-03-21T14:30:00Z",
  },
  {
    id: "swap_003",
    from: "BTC",
    to: "ETH",
    amount: "0.05",
    toAmount: "1.8",
    status: SwapStatus.EXPIRED,
    date: "2024-03-19T08:15:00Z",
  },
];

export default function HistoryPage() {
  const { isConnected } = useWalletStore();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20 animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-overlay border border-border font-bold text-text-primary">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Swap History</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Track and manage your cross-chain atomic swaps.
            </p>
          </div>
        </div>
        <Button variant="secondary" size="sm" icon={<Filter className="h-4 w-4" />}>
          Filter
        </Button>
      </div>

      {!isConnected ? (
        <Card variant="glass" className="py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-overlay mb-6 border border-border text-text-muted">
            <History className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Connect your wallet</h2>
          <p className="mt-2 text-text-secondary">
            Please connect your wallet to view your historical swaps.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {MOCK_SWAPS.map((swap) => (
            <Card key={swap.id} hover className="flex items-center justify-between p-6 overflow-hidden">
              <div className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  <div className="h-10 w-10 rounded-full border-2 border-background bg-surface flex items-center justify-center text-xs font-bold">
                    {swap.from}
                  </div>
                  <div className="h-10 w-10 rounded-full border-2 border-background bg-surface flex items-center justify-center text-xs font-bold">
                    {swap.to}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary">{swap.amount} {swap.from}</span>
                    <ArrowRight className="h-3 w-3 text-text-muted" />
                    <span className="font-bold text-text-primary">{swap.toAmount} {swap.to}</span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    {new Date(swap.date).toLocaleDateString()} at {new Date(swap.date).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge status={swap.status} />
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
          
          <div className="pt-6 text-center">
            <p className="text-xs text-text-muted">
              Showing {MOCK_SWAPS.length} recent swaps
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
