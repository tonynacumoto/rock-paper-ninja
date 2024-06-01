"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getParticipantsList } from "~~/app/actions";

export default function RoomCard({ roomId }: { roomId: string }) {
  const [loading, setLoading] = useState(false);
  const [activePeers, setActivePeers] = useState<any[]>([]);
  useEffect(() => {
    async function getParticipants() {
      setLoading(true);
      const data = await getParticipantsList(roomId);
      console.log(data);
      if (data) {
        setActivePeers(data?.participants);
      }
      setLoading(false);
    }
    getParticipants();
  }, [roomId]);
  return (
    <Link href={`/${roomId}`}>
      {loading ? (
        <div className="rounded-md bg-gray-100 p-4 text-blue-500 text-center">Loading...</div>
      ) : (
        <div className="rounded-md bg-gray-100 p-4 text-blue-500 text-center">
          <p>RoomId: {roomId}</p>
          <p>Active peers: {activePeers.length}</p>
        </div>
      )}
    </Link>
  );
}
