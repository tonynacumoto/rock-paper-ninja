"use client";

import Link from "next/link";

export default function RoomCard({ roomId }: { roomId: string }) {
  return (
    <Link href={`/${roomId}`}>
      <div className="rounded-md bg-gray-100 p-4 text-blue-500 text-center">{roomId}</div>
    </Link>
  );
}
