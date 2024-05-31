"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@vercel/kv";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract, useTargetNetwork } from "~~/hooks/scaffold-eth";

const store = createClient({
  url: process.env.NEXT_PUBLIC_KV_REST_API_URL,
  token: process.env.NEXT_PUBLIC_KV_REST_API_TOKEN,
});

const DEAD_ADDRESS = "0x0000000000000000000000000000000000000000";

const setStore = async ({ chain, id, matchData }: { chain: number; id: number | string; matchData: object }) => {
  console.log("setting store");
  try {
    const value = await store.set(`${chain}-${id}`, matchData);
    return value;
  } catch (error) {
    // Handle errors
    console.log("error", error);
  }
};

const getStore = async ({ chain, id }: { chain: number; id: string }) => {
  console.log("getting store");
  try {
    const match = await store.get(`${chain}-${id}`);
    return match;
  } catch (error) {
    // Handle errors
    console.log("error", error);
  }
};

const EscrowButton = ({ id, chainId }: { id: bigint; chainId: number }) => {
  const escrowInt = BigInt(id).toString();
  const [match, setMatch] = useState<object>();
  const { writeContractAsync: writeEscrowAsync } = useScaffoldWriteContract("Escrow");
  const { data = [] } = useScaffoldReadContract({
    contractName: "Escrow",
    functionName: "escrows",
    args: [id as bigint],
  });
  const [, , , depositor2, amount, ,] = data;
  const isFilled = depositor2 !== DEAD_ADDRESS;
  useEffect(() => {
    async function fetchMatch() {
      const match = await getStore({ id: escrowInt, chain: chainId });
      console.log("use eff match", match);
      setMatch(match as object);
    }
    if (!match) {
      fetchMatch();
    }
  }, [match, setMatch, chainId, escrowInt]); // Include 'chainId' and 'escrowInt' in the dependency array
  console.log("match", match);
  return (
    <>
      <button
        className="btn btn-primary"
        disabled={isFilled}
        onClick={async () => {
          console.log("writing to blockchain");
          try {
            const writeResponse = await writeEscrowAsync({
              functionName: "joinEscrow",
              args: [id as bigint],
              value: parseEther("0.1"),
            });
            console.log("block writeRes", writeResponse, escrowInt, chainId);
            const cleanData = (rawData: any[] | readonly [bigint, number, string, string, bigint, boolean, string]) =>
              rawData.map(item => (typeof item === "bigint" ? BigInt(item).toString() : item));
            const setResponse = await setStore({
              chain: chainId,
              id: escrowInt,
              matchData: {
                id: `${chainId}-${escrowInt}`,
                smartContractData: cleanData(data),
                winner: undefined,
                loser: undefined,
                winnerHands: [],
                loserHands: [],
                date: new Date(),
              },
            });
            console.log("setRes", setResponse);
          } catch (e) {
            console.error("Error joining escrow:", e);
          }
        }}
      >
        {isFilled ? `Match ${escrowInt} underway` : `Join Match #${escrowInt} for ${amount && formatEther(amount)} ETH`}
      </button>
    </>
  );
};

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { targetNetwork } = useTargetNetwork();
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
          <div className="flex justify-center items-center space-x-2 mt-2">
            <Link href="/lobby">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Go to lobby
              </button>
            </Link>
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
                  return <EscrowButton key={escrowId} id={escrowId} chainId={targetNetwork.id} />;
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
