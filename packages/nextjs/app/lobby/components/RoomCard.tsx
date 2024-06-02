"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { parseEther } from "viem";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function RoomCard({ escrowId }: { escrowId: bigint }) {
  const router = useRouter();
  const { writeContractAsync: writeEscrowAsync } = useScaffoldWriteContract("Escrow");
  return (
    <div className="card card-compact w-96 bg-base-100 shadow-xl">
      <figure>
        <Image src="/logo.png" width={600} height={300} alt="Logo" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Room {escrowId.toString()}</h2>
        <p>This is a .1ETH game. Best 2/3</p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary"
            onClick={async () => {
              await writeEscrowAsync({
                functionName: "joinEscrow",
                args: [escrowId],
                value: parseEther("0.1"),
              });

              router.push(`/${escrowId}`);
            }}
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
