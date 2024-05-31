"use client";

import { useEffect } from "react";
import { useLocalPeer, useRoom } from "@huddle01/react/hooks";
import { useAccount } from "wagmi";

export default function Room({ roomId, token }: { roomId: string; token: string }) {
  const { address } = useAccount();
  const { peerId } = useLocalPeer();

  const { room, state, joinRoom, leaveRoom } = useRoom({
    onJoin: () => {
      console.log("Joined the room");
    },
    onLeave: () => {
      console.log("Left the room");
    },
  });
  console.log(room);
  useEffect(() => {
    joinRoom({
      roomId,
      token,
    });
    return () => {
      leaveRoom();
    };
  }, [joinRoom, leaveRoom, roomId, token]);
  return (
    <div>
      <p>Current state: {state}</p>
      <p>Connected address: {address || "not connected"}</p>
      <p>Peer ID: {peerId}</p>
    </div>
  );
}
