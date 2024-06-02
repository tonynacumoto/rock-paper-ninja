"use client";

import { useEffect, useState } from "react";
import Player from "./Player";
import { isEqual } from "lodash";
import { parseEther } from "viem";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { ZERO_ADDRESS, cleanBigIntData, shortenHash } from "~~/utils/scaffold-eth/common";
import { getStore, setStore } from "~~/utils/store";

/*
 *
 *
 *  MATCH VARIABLES
 *
 *
 */
const Match = ({ id, chainId }: { id: bigint; chainId: number }) => {
  const escrowInt = BigInt(id).toString();
  const [needsUpdate, setNeedsUpdate] = useState<boolean>();
  const [fetching, setFetching] = useState<boolean>();
  const [syncing, setSyncing] = useState<boolean>();
  const { address } = useAccount();
  const { writeContractAsync: writeEscrowAsync } = useScaffoldWriteContract("Escrow");
  const { data: smartContractData = [] } = useScaffoldReadContract({
    contractName: "Escrow",
    functionName: "escrows",
    args: [id as bigint],
  });
  const [, , , depositor2, amount, ,] = cleanBigIntData(smartContractData);
  const isReady = depositor2 && depositor2 !== ZERO_ADDRESS;
  const [match, setMatch] = useState<{ smartContractData?: any }>(); // Define the type of 'match' as an object with a 'smartContractData' property
  const storeKey = `${chainId}-${escrowInt}`;

  const cleanSmartContractData = cleanBigIntData(smartContractData);
  const dataMatches = isEqual(cleanSmartContractData, match?.smartContractData);

  /*
   *
   *
   *  USE EFFECT
   *
   *
   */
  useEffect(() => {
    console.log("match", match);
    async function fetchMatch() {
      setFetching(true);
      const _match = await getStore({ key: storeKey });
      setMatch(_match as object);
      setFetching(false);
      setNeedsUpdate(false);
    }
    async function syncMatchDataWithContract() {
      setSyncing(true);
      const updatedMatchData = {
        ...match,
        smartContractData: cleanSmartContractData,
      };
      await setStore({
        key: storeKey,
        data: updatedMatchData,
      });
      setSyncing(false);
      setMatch(updatedMatchData as object);
      setNeedsUpdate(false);
    }
    /*
     *
     * FETCHING LOGIC
     *
     */
    if ((!match || needsUpdate) && !fetching && isReady) {
      fetchMatch();
    }
    if (match && !dataMatches && !syncing) {
      syncMatchDataWithContract();
    }
  }, [
    match,
    setMatch,
    chainId,
    escrowInt,
    needsUpdate,
    smartContractData,
    fetching,
    syncing,
    isReady,
    storeKey,
    dataMatches,
    cleanSmartContractData,
  ]);
  /*
   *
   *
   *  JSX
   *
   *
   */
  return (
    <div className="flex flex-col mb-2 mr-2">
      <button
        className="btn btn-success mb-2"
        disabled={isReady}
        onClick={async () => {
          console.log("writing to blockchain");
          try {
            const writeResponse = await writeEscrowAsync({
              functionName: "joinEscrow",
              args: [id as bigint],
              value: parseEther("0.1"),
            });
            console.log("block writeRes", writeResponse, escrowInt, chainId);

            const sanitizedData = cleanBigIntData(smartContractData);
            sanitizedData[3] = address;
            await setStore({
              key: storeKey,
              data: {
                id: `${chainId}-${escrowInt}`,
                smartContractData: sanitizedData,
                round: 0,
                firstTo: 2,
                player1: {
                  address: sanitizedData[2],
                  throws: [],
                },
                player2: {
                  address: sanitizedData[3],
                  throws: [],
                },
                date: new Date(),
              },
            });
          } catch (e) {
            console.error("Error joining escrow:", e);
          }
        }}
      >
        {isReady ? `Match ${escrowInt} Underway` : `Join Match #${escrowInt} for ${amount && formatEther(amount)} ETH`}
      </button>

      <div className="flex flex-col items-baseline">
        {match && (
          <Player
            storeKey={storeKey}
            player="player1"
            text={shortenHash(smartContractData[2]) ?? ""}
            addressOfUser={address || ""}
            match={match}
            refreshMatch={() => {
              setNeedsUpdate(true);
            }}
          />
        )}

        {match && (
          <Player
            storeKey={storeKey}
            player="player2"
            text={shortenHash(smartContractData[3]) || ""}
            addressOfUser={address || ""}
            match={match}
            refreshMatch={() => {
              console.log("refreshing from player");
              setNeedsUpdate(true);
            }}
          />
        )}
      </div>
    </div>
  );
};
export default Match;
