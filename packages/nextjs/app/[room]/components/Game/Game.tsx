import { useCallback, useEffect, useState } from "react";
import { useDataMessage, useLocalPeer } from "@huddle01/react/hooks";

const MOVE_OPTIONS = ["rock", "paper", "scissors"];

export type TMove = {
  move: string;
  sender: string;
  gameId: number;
};

function Game() {
  const [moves, setMoves] = useState<TMove[]>([]);
  const [gameId, setGameId] = useState(0);

  const { peerId } = useLocalPeer();
  const [moveMade, setMoveMade] = useState(false);
  const [gameResult, setGameResult] = useState("");

  const getMoves = useCallback(
    (gameId: number) => {
      return moves.filter(move => move.gameId === gameId);
    },
    [moves],
  );

  const determineWinner = useCallback(
    (gameId: number) => {
      const moves = getMoves(gameId);
      const yourMove = moves.find(move => move.sender === peerId);
      const opponentMove = moves.find(move => move.sender !== peerId);
      if (yourMove === undefined || opponentMove === undefined) {
        return "tie";
      }
      if (yourMove.move === opponentMove.move) {
        return "tie";
      }
      if (yourMove.move === "rock") {
        return opponentMove.move === "paper" ? `You lost` : `You won`;
      }
      if (yourMove.move === "paper") {
        return opponentMove.move === "scissors" ? `You lost` : `You won`;
      }
      if (yourMove.move === "scissors") {
        return opponentMove.move === "rock" ? `You lost` : `You won`;
      }
      return "tie";
    },
    [getMoves, peerId],
  );

  const { sendData } = useDataMessage({
    onMessage: (payload, from, label) => {
      if (label === "move") {
        setMoves(prev => [...prev, { move: payload, sender: from, gameId }]);
      }

      if (label === "server-message") {
        console.log("Recording", JSON.parse(payload)?.s3URL);
      }
    },
  });

  const sendMove = (move: string) => {
    if (!peerId) {
      return;
    }

    setMoveMade(true);
    sendData({
      to: "*",
      payload: move,
      label: "move",
    });
  };

  useEffect(() => {
    const moves = getMoves(gameId);

    if (moves.length === 2) {
      const result = determineWinner(gameId);
      setGameResult(result);
      setMoveMade(false);
      setGameId(gameId + 1);
      setMoves([]);
    }
  }, [determineWinner, gameId, getMoves, moves]);

  const currentGameMoves = getMoves(gameId);
  const youMadeMove = currentGameMoves.find(move => move.sender === peerId);
  const opponentMove = currentGameMoves.find(move => move.sender !== peerId);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-center">
          {MOVE_OPTIONS.map(move => (
            <button key={move} onClick={() => sendMove(move)} disabled={moveMade} className="btn btn-primary">
              {move === "rock" ? "🪨" : move === "paper" ? "📄" : "✂️"}
            </button>
          ))}
        </div>
        {gameResult && <div className="text-center">{gameResult}</div>}
        {youMadeMove && <div className="text-center">You made a move</div>}
        {opponentMove && <div className="text-center">Opponent made a move</div>}
      </div>
    </div>
  );
}

export default Game;
