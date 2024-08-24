"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { AddressInput, IntegerInput } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const StakingPage: React.FC = () => {
  const [tokenAddress, setTokenAddress] = useState<any>("");
  const [txValue, setTxValue] = useState<string | bigint>("");
  const { address } = useAccount();
  const { writeContractAsync: allowance } = useScaffoldWriteContract("Token");
  const { data: stakingContract } = useDeployedContractInfo("Staking");
  const { writeContractAsync: staking } = useScaffoldWriteContract("Staking");
  const { data: allowed } = useScaffoldReadContract({
    contractName: "Token",
    functionName: "allowance",
    args: [address, stakingContract?.address],
  });
  const { data: stakedBalance } = useScaffoldReadContract({
    contractName: "Staking",
    functionName: "stakedBalanceOf",
    args: [address],
  });
  const { data: balance } = useScaffoldReadContract({
    contractName: "Token",
    functionName: "balanceOf",
    args: [address],
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-secondary text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-6">Ninja Token Staking</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Set Ninja Token Address</h2>

          <AddressInput onChange={setTokenAddress} value={tokenAddress} placeholder="Input token address" />
          <button
            className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md"
            onClick={() => staking({ functionName: "setNinjaToken", args: [tokenAddress] })}
          >
            Set Token Address
          </button>
        </div>
        :
        <>
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-2">Your Staked Balance</h2>
            <p className="text-3xl font-bold mb-4">{stakedBalance?.toString()} Tokens</p>

            <h2 className="text-xl font-medium mb-2">Your Available Balance</h2>
            <p className="text-3xl font-bold mb-4">{balance?.toString()} Tokens</p>
            <IntegerInput
              value={txValue}
              onChange={updatedTxValue => {
                setTxValue(updatedTxValue);
              }}
              placeholder="value (wei)"
            />
          </div>

          <div className="flex justify-between">
            <button
              className="w-[48%] py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
              onClick={() =>
                allowed && allowed >= BigInt(txValue)
                  ? staking({ functionName: "stake", args: [BigInt(txValue)] })
                  : allowance({ functionName: "approve", args: [stakingContract?.address, BigInt(txValue)] })
              }
            >
              Stake
            </button>
            <button
              className="w-[48%] py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md"
              onClick={() => staking({ functionName: "withdraw", args: [BigInt(txValue)] })}
            >
              Withdraw
            </button>
          </div>
        </>
      </div>
    </main>
  );
};

export default StakingPage;
