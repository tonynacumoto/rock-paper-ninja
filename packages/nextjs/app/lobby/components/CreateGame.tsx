"use client";

import { useRouter } from "next/navigation";
import { parseEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function CreateGame() {
  const router = useRouter();
  const { data: allEscrowIds } = useScaffoldReadContract({
    contractName: "Escrow",
    functionName: "getAllEscrows",
  });
  const { writeContractAsync: writeEscrowAsync } = useScaffoldWriteContract("Escrow");
  const createGame = async () => {
    try {
      await writeEscrowAsync({
        functionName: "depositEth",
        value: parseEther("0.1"),
      });
      router.push(`/${allEscrowIds?.length}`);
    } catch (e) {
      console.error("Error creating escrow:", e);
    }
  };
  return (
    <button className="btn btn-primary my-4" onClick={createGame}>
      Create game
    </button>
  );
}
