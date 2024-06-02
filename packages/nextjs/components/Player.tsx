"use client";

import { useState } from "react";
import { privateKeyToAccount } from "viem/accounts";
import { useChainId } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { getBlockExplorerTxLink } from "~~/utils/scaffold-eth";
import { setStore } from "~~/utils/store";

const determineWinner = (throw1: string, throw2: string) => {
  if (throw1 === throw2) {
    return "draw";
  }

  if ((throw1 === "r" && throw2 === "s") || (throw1 === "s" && throw2 === "p") || (throw1 === "p" && throw2 === "r")) {
    return "player1";
  } else {
    return "player2";
  }
};
const winLossRecord = ({ throws1 = [], throws2 = [] }: { throws1: any; throws2: any }) => {
  return throws1.map((throw1: any, i: string | number) => determineWinner(throw1, throws2[i]));
};
const Player = ({
  text,
  addressOfUser,
  storeKey,
  player,
  match,
  refreshMatch,
}: {
  text: string | undefined;
  addressOfUser: string;
  storeKey: string;
  player: string;
  match: any;
  refreshMatch: () => void;
}) => {
  const round = match.round || 0;
  const isPlayer = match[player].address === addressOfUser;
  const otherPlayer = player === "player1" ? match.player2 : match.player1;
  const myThrows = match[player].throws;
  const chainId = useChainId();
  const [gameEnded, setGameEnded] = useState(false);
  const [transactionLink, setTransactionLink] = useState<string | null>(null);

  const winLosses = winLossRecord({ throws1: match.player1.throws, throws2: match.player2.throws });
  const { writeContractAsync: writeEscrowAsync } = useScaffoldWriteContract("Escrow");
  const account = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_OWNER_PK}`);

  const triggerEnd = async (winner: string) => {
    console.log("winner", winner);
    const winnerAddress = match[winner].address;
    try {
      const writeResponse = await writeEscrowAsync({
        functionName: "releaseFunds",
        args: [match.smartContractData[0], winnerAddress, JSON.stringify(match)],
        account,
      });

      const link = getBlockExplorerTxLink(chainId, writeResponse as `0x${string}`);

      if (winner === addressOfUser) {
        // show modal
        setTransactionLink(link);
      } else {
        setTransactionLink(link);
      }
      setGameEnded(true);
      console.log("writeResponse", writeResponse);
    } catch (error) {
      console.log("error releasing", error);
    }
  };
  // console.log("already", alreadyThrown, match.round, match[player].throws.length);
  const handleThrow = ({ throwValue }: { throwValue: any }) => {
    console.log("throw", throwValue);
    const mutablePlayer = { ...match[player] };
    const updatedData = {
      ...match,
      [player]: {
        ...mutablePlayer,
        throws: [...mutablePlayer.throws, throwValue],
      },
    };
    const _bothHaveGone = updatedData[player].throws.length <= otherPlayer.throws.length;
    if (_bothHaveGone) {
      updatedData.round++;
      const player1WinCount = winLosses.filter((winner: string) => winner === "player1").length;
      const player2WinCount = winLosses.filter((winner: string) => winner === "player2").length;
      console.log(
        "round",
        round,
        "ratio",
        winLosses,
        "player1WinCount",
        player1WinCount,
        "player2WinCount",
        player2WinCount,
      );
      if (player1WinCount === match.firstTo) {
        triggerEnd("player1");
      }
      if (player2WinCount === match.firstTo) {
        triggerEnd("player2");
      }
    }
    setStore({
      key: storeKey,
      data: updatedData,
    });
    refreshMatch();
  };
  const buttonDisabled = !isPlayer;
  return (
    <div className={`flex items-center`}>
      {/* {JSON.stringify(match[player].throws)} */}
      {!gameEnded && (
        <div className="dropdown">
          <div tabIndex={0} role="button" className={`m-1 btn ${buttonDisabled ? "btn-disabled" : ""}`}>
            {text}
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li onClick={() => handleThrow({ throwValue: "r" })}>
              <a>rock</a>
            </li>
            <li onClick={() => handleThrow({ throwValue: "p" })}>
              <a>paper</a>
            </li>
            <li onClick={() => handleThrow({ throwValue: "s" })}>
              <a>scissors</a>
            </li>
          </ul>
        </div>
      )}
      <div className="dropdown">
        <div tabIndex={0} role="button" className={`m-1 btn ${buttonDisabled ? "btn-disabled" : ""}`}>
          {text}
        </div>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
          <li onClick={() => handleThrow({ throwValue: "r" })}>
            <a>rock</a>
          </li>
          <li onClick={() => handleThrow({ throwValue: "p" })}>
            <a>paper</a>
          </li>
          <li onClick={() => handleThrow({ throwValue: "s" })}>
            <a>scissors</a>
          </li>
        </ul>
      </div>
      {match[player].throws.map((throwValue: any, i: number) => {
        const moreThrowsThanCount = i >= round;
        const moreThrowsThanOpponent = myThrows.length > otherPlayer.throws.length;
        const keepSecret = moreThrowsThanCount && moreThrowsThanOpponent;
        const backgroundColor =
          keepSecret || winLosses[i] === "draw"
            ? "bg-gray-200"
            : winLosses[i] === player
            ? `bg-green-400`
            : `bg-red-400`;
        return (
          <div key={i} className={`flex justify-center items-center w-6 h-6 ${backgroundColor}`}>
            {keepSecret ? "?" : throwValue}
          </div>
        );
      })}
      {transactionLink && (
        <a href={transactionLink} target="_blank">
          Transaction Link
        </a>
      )}
    </div>
  );
};

export default Player;
