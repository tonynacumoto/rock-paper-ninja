"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Player from "./Player";
import { isEqual } from "lodash";
import { parseEther } from "viem";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { getBlockExplorerTxLink } from "~~/utils/scaffold-eth";
import { ZERO_ADDRESS, cleanBigIntData, shortenHash } from "~~/utils/scaffold-eth/common";
import { getStore, setStore } from "~~/utils/store";

/*
 *
 *
 *  MATCH VARIABLES
 *
 *
 */
const Match = ({
  id,
  chainId,
  cta = true,
  allowSpectate,
}: {
  id: bigint;
  chainId: number;
  cta?: boolean;
  allowSpectate?: boolean;
}) => {
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
  console.log("smartContractData:", smartContractData);
  const [, , , depositor2, amount, isFinished] = cleanBigIntData(smartContractData);
  const isReady = depositor2 && depositor2 !== ZERO_ADDRESS;
  const [match, setMatch] = useState<{ closingHash?: string; smartContractData?: any }>(); // Define the type of 'match' as an object with a 'smartContractData' property
  const storeKey = `${chainId}-${escrowInt}`;
  const router = useRouter();

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
    async function fetchMatch() {
      setFetching(true);
      const _match = await getStore({ key: storeKey });
      if (_match) {
        setMatch(_match as object);
        // by only having this code run if match present
        // prevents from being fetched again if non-existent
        // todo: add in error message that store cannot be found
        // happens when smart contract and KV fall out of sync
        setFetching(false);
        setNeedsUpdate(false);
      }
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
      setFetching(false);
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
    <div className="flex flex-col">
      {cta ? (
        <button
          className="btn btn-success mb-2"
          disabled={isReady}
          onClick={async () => {
            console.log("writing to blockchain");
            try {
              await writeEscrowAsync({
                functionName: "joinEscrow",
                args: [id as bigint],
                value: parseEther("0.1"),
              });

              const sanitizedData = cleanBigIntData(smartContractData);
              sanitizedData[3] = address;

              const _store = await setStore({
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
              setNeedsUpdate(true);
              console.log("_store:", _store);
            } catch (e) {
              console.error("Error joining escrow:", e);
            }
          }}
        >
          {isReady
            ? `Match ${escrowInt} ${isFinished ? "Closed" : "Underway"}`
            : `Join Match #${escrowInt} for ${amount && formatEther(amount)} ETH`}
        </button>
      ) : (
        <>Click your address to throw an attack</>
      )}

      <div className="flex flex-col items-center justify-center">
        {match && !match?.closingHash && (
          <>
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
            {allowSpectate && (
              <div
                className="underline text-gray-300 cursor-pointer mt-4"
                onClick={() => router.push(`match/${escrowInt}`)}
              >
                spectate match
              </div>
            )}
          </>
        )}
      </div>
      {match?.closingHash && (
        <a href={getBlockExplorerTxLink(chainId, match?.closingHash as `0x${string}`)} target="_blank" className="mt-1">
          Transaction Link
        </a>
      )}
    </div>
  );
};
export default Match;
