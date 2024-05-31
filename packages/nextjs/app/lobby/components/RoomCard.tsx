"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPreviewPeers } from "~~/app/actions";

export default function RoomCard({ roomId }: { roomId: string }) {
  const [loading, setLoading] = useState(false);
  const [activePeers, setActivePeers] = useState<string[]>([]);
  useEffect(() => {
    async function fetchRoom() {
      setLoading(true);
      const data = await getPreviewPeers(roomId);
      setActivePeers(data);
      setLoading(false);
    }
    fetchRoom();
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
