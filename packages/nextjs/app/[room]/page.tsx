"use client";

export default function Page({ params }: { params: { room: string } }) {
  return <main className="flex min-h-screen p-24">Room {params.room}</main>;
}
