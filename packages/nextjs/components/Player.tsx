"use client";

import { setStore } from "~~/utils/store";

// import { cleanBigIntData, shortenHash } from "~~/utils/scaffold-eth/common";

// const defaultMatchData = {
//   winner: undefined,
//   loser: undefined,
//   winnerHands: [],
//   loserHands: [],
//   date: new Date(),
// };

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
  const handleThrow = ({ throwValue }: { throwValue: any }) => {
    const mutablePlayer = { ...match[player] };
    const updatedData = { ...match, [player]: { ...mutablePlayer, throws: [...mutablePlayer.throws, throwValue] } };
    setStore({
      key: storeKey,
      data: updatedData,
    });
    refreshMatch();
  };
  const isPlayer = match[player].address === addressOfUser;
  console.log("player", isPlayer, player, match[player].address, addressOfUser, match);
  return (
    <details className="dropdown">
      <summary className={`m-1 btn ${isPlayer ? "btn-disabled" : ""}`} aria-disabled={!isPlayer}>
        {text}
      </summary>
      <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
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
    </details>
  );
};

export default Player;
