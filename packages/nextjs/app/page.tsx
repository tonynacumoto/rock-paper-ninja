"use client";

import Match from "../components/Match";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract, useTargetNetwork } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
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
          {process.env.NODE_ENV === "development" && (
            <div className="justify-center flex flex-col mt-8 ">
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
                Start .1 ETH Match - Best of 3
              </button>
              <div className="flex flex-col w-full border-opacity-50">
                <div className="divider">MATCHES</div>
              </div>
              <div className="flex justify-center max-w-lg flex-wrap flex-col-reverse items-center">
                {allEscrowIds &&
                  allEscrowIds?.map(escrowId => {
                    return (
                      <div key={escrowId} className="card card-compact w-96 bg-base-100 shadow-xl mb-4">
                        <div className="card-body">
                          <Match key={escrowId} id={escrowId} chainId={targetNetwork.id} allowSpectate={true} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
