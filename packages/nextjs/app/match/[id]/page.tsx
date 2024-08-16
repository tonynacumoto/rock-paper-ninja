"use client";

import Match from "~~/components/Match";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";

export default function Page({ params }: { params: { id: string; escrowId: number } }) {
  const { targetNetwork } = useTargetNetwork();
  const hasId = params.id;
  return (
    <main className="flex p-12 justify-center">
      {hasId ? (
        <Match id={BigInt(params.id || 0)} chainId={targetNetwork.id} cta={false} />
      ) : (
        <div> no match with that id</div>
      )}
    </main>
  );
}
