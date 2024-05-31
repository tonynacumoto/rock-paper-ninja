"use client";

import { createClient } from "@vercel/kv";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const store = createClient({
  url: process.env.NEXT_PUBLIC_KV_REST_API_URL,
  token: process.env.NEXT_PUBLIC_KV_REST_API_TOKEN,
});

const DEAD_ADDRESS = "0x0000000000000000000000000000000000000000";

const EscrowButton = ({ id }: { id: string | number | bigint | boolean }) => {
  const escrowInt = BigInt(id).toString();
  const { writeContractAsync: writeEscrowAsync } = useScaffoldWriteContract("Escrow");
  const { data = [] } = useScaffoldReadContract({
    contractName: "Escrow",
    functionName: "escrows",
    args: [id as bigint],
  });
  const [, , , depositor2, amount, ,] = data;
  const isFilled = depositor2 !== DEAD_ADDRESS;
  const callStore = async () => {
    console.log("calling", process.env.NEXT_PUBLIC_KV_REST_API_URL);
    const user = await store.hgetall("user:me");
    console.log("user", user);
    return user;
  };
  return (
    <button
      className="btn btn-primary"
      disabled={isFilled}
      onClick={async () => {
        callStore();
        try {
          await writeEscrowAsync({
            functionName: "joinEscrow",
            args: [id as bigint],
            value: parseEther("0.1"),
          });
        } catch (e) {
          console.error("Error joining escrow:", e);
        }
      }}
    >
      {isFilled ? `Match ${escrowInt} underway` : `Join Match #${escrowInt} for ${amount && formatEther(amount)} ETH`}
    </button>
  );
};

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { writeContractAsync: writeEscrowAsync } = useScaffoldWriteContract("Escrow");
  const { data: allEscrowIds } = useScaffoldReadContract({
    contractName: "Escrow",
    functionName: "getAllEscrows",
  });
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">🪨 Rock 📜 Paper 🥷 Ninja</span>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <div className="space-y-2 justify-center flex flex-col mt-4">
            <button
              className="btn btn-primary"
              onClick={async () => {
                try {
                  await writeEscrowAsync({
                    functionName: "depositEth",
                    value: parseEther("0.1"),
                  });
                } catch (e) {
                  console.error("Error creating escrow:", e);
                }
              }}
            >
              Start .1 ETH Match
            </button>
            <div className="flex space-x-2 justify-center">
              {allEscrowIds &&
                allEscrowIds?.map(escrowId => {
                  return <EscrowButton key={escrowId} id={escrowId} />;
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
