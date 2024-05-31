"use client";

import { useRouter } from "next/navigation";
import { createRoom } from "~~/app/actions";

export default function CreateGame() {
  const router = useRouter();
  const createGame = async () => {
    const huddleRoomId = await createRoom();
    router.push(`/${huddleRoomId}`);
  };
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={createGame}>
      Create game
    </button>
  );
}
