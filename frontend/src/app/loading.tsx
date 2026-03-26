"use client";

import { LoadingState } from "@/components/ui/spinner";

export default function RootLoading() {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <LoadingState label="Preparing the bridge..." size="lg" />
    </div>
  );
}
