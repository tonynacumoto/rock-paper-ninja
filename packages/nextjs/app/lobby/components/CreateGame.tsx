"use client";

import { useRouter } from "next/navigation";
import { createRoom } from "~~/app/actions";

export default function CreateGame() {
  const router = useRouter();
  const createGame = async () => {
    console.log("button trigger");
    const huddleRoomId = await createRoom();
    console.log("huddleRoomId:", huddleRoomId);
    router.push(`/${huddleRoomId}`);
  };
  return (
    <button className="btn btn-primary my-4" onClick={createGame}>
      Create game
    </button>
  );
}
