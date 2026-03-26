"use client";

import { useState } from "react";
import { Card, Button, Input, Badge, CardHeader, CardContent, CardFooter } from "@/components/ui";
import { ArrowRightLeft, Settings, Info, AlertCircle } from "lucide-react";
import { useWalletStore } from "@/hooks/useWallet";

export default function SwapPage() {
  const { isConnected } = useWalletStore();
  const [amount, setAmount] = useState("");

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 md:py-20 animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Create Swap</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Configure your cross-chain atomic swap.
          </p>
        </div>
        <Button variant="ghost" size="sm" icon={<Settings className="h-4 w-4" />}>
          Settings
        </Button>
      </div>

      <Card variant="raised" className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-surface-overlay/50 py-4">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Swap Configuration
          </span>
          <Badge variant="info">HTLC Enabled</Badge>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* From Chain */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text-secondary">From</label>
              <span className="text-xs text-text-muted">Balance: 0.00</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="0.00"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <Button variant="secondary" className="min-w-[120px]">
                Stellar XLM
              </Button>
            </div>
          </div>

          {/* Switch Button */}
          <div className="flex justify-center -my-3">
            <div className="z-10 rounded-full bg-background p-1 shadow-sm border border-border">
              <div className="rounded-full bg-surface-overlay p-2 text-brand-500 hover:bg-brand-500 hover:text-white transition cursor-pointer">
                <ArrowRightLeft className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* To Chain */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text-secondary">To (Estimated)</label>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input placeholder="0.00" type="number" readOnly className="bg-surface/50" />
              </div>
              <Button variant="secondary" className="min-w-[120px]">
                Bitcoin BTC
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-xl bg-surface-overlay p-4 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Exchange Rate</span>
              <span className="text-text-primary font-medium">1 XLM ≈ 0.0000018 BTC</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Platform Fee (0.1%)</span>
              <span className="text-text-primary font-medium">0.00 XLM</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Timelock Duration</span>
              <span className="text-text-primary font-medium">24 Hours</span>
            </div>
          </div>

          {!isConnected && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-[13px] text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>Please connect your wallet to initiate a cross-chain swap.</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-surface-overlay/30">
          <Button 
            className="w-full h-12 rounded-xl text-lg font-bold" 
            disabled={!isConnected || !amount}
          >
            {isConnected ? "Initialize Atomic Swap" : "Connect Wallet to Swap"}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8 flex items-start gap-3 rounded-2xl bg-brand-500/5 border border-brand-500/10 p-6 text-sm text-text-secondary">
        <Info className="h-5 w-5 shrink-0 text-brand-500 mt-0.5" />
        <div>
          <h4 className="font-semibold text-text-primary mb-1">How it works?</h4>
          <p>
            Your assets are locked in a smart contract (HTLC) and can only be released 
            if the recipient provides a secret hash. This ensures both parties either 
            receive their funds or get a full refund if the swap expires.
          </p>
        </div>
      </div>
    </div>
  );
}
