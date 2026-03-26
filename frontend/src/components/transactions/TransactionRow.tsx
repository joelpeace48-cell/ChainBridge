"use client";

import { useMemo } from "react";
import { Transaction, TransactionStatus } from "@/types";
import { CheckCircle2, Clock, AlertCircle, ChevronRight, ExternalLink, ShieldCheck, ShieldAlert } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { clsx } from "clsx";

interface TransactionRowProps {
  tx: Transaction;
}

export function TransactionRow({ tx }: TransactionRowProps) {
  const statusIcon = useMemo(() => {
    switch (tx.status) {
      case TransactionStatus.COMPLETED:
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case TransactionStatus.CONFIRMING:
        return <Clock className="h-5 w-5 text-brand-500 animate-pulse" />;
      case TransactionStatus.FAILED:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-text-muted" />;
    }
  }, [tx.status]);

  const progress = useMemo(() => {
    if (tx.status === TransactionStatus.COMPLETED) return 100;
    if (tx.requiredConfirmations === 0) return 0;
    return Math.min(Math.round((tx.confirmations / tx.requiredConfirmations) * 100), 99);
  }, [tx.confirmations, tx.requiredConfirmations, tx.status]);

  const explorerUrl = useMemo(() => {
    switch (tx.chain.toLowerCase()) {
      case "stellar": return `https://stellar.expert/explorer/testnet/tx/${tx.hash}`;
      case "ethereum": return `https://sepolia.etherscan.io/tx/${tx.hash}`;
      case "bitcoin": return `https://mempool.space/testnet/tx/${tx.hash}`;
      default: return "#";
    }
  }, [tx.chain, tx.hash]);

  return (
    <div className="group relative flex items-center justify-between border-b border-border/50 bg-surface/30 p-4 transition hover:bg-surface-overlay/30 first:rounded-t-2xl last:rounded-b-2xl last:border-0 md:px-6">
        <div className="flex items-center gap-4 md:gap-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-overlay border border-border shadow-sm">
          {statusIcon}
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-text-primary">{tx.amount} {tx.token}</span>
            <Badge variant="default" className="text-[10px] uppercase tracking-tighter">
              {tx.chain}
            </Badge>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
             <span className="font-mono">{tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}</span>
             <span>•</span>
             <span>{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      <div className="hidden flex-1 px-8 md:block">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-text-muted">
            <span>Progress</span>
            <span>{tx.confirmations} / {tx.requiredConfirmations} Confirmed</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-overlay border border-border/50">
            <div 
              className={clsx(
                "h-full transition-all duration-500",
                tx.status === TransactionStatus.COMPLETED ? "bg-emerald-500" : "bg-brand-500"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {tx.proofVerified !== undefined && (
          <div className="flex items-center gap-1.5">
             {tx.proofVerified ? (
               <span title="HTLC Proof Verified">
                 <ShieldCheck className="h-4 w-4 text-emerald-500" />
               </span>
             ) : (
               <span title="Awaiting Proof">
                 <Clock className="h-4 w-4 text-text-muted" />
               </span>
             )}
          </div>
        )}

        
        <div className="flex items-center gap-1">
          <a 
            href={explorerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-text-muted hover:bg-surface-overlay hover:text-text-primary transition"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 group-hover:bg-brand-500/10 group-hover:text-brand-500">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
