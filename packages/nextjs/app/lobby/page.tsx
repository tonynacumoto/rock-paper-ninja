"use client";

import { useEffect, useState } from "react";
import { getLiveMeetings } from "../actions";
import CreateGame from "./components/CreateGame";
import RoomCard from "./components/RoomCard";
import type { NextPage } from "next";

export const revalidate = 0;

type RoomInfo = {
  roomId: string;
};

const Lobby: NextPage = () => {
  const [rooms, setRooms] = useState<any>();
  const [loading, setLoading] = useState(false);
  const fetchRooms = async () => {
    setLoading(true);
    const roomsData = await getLiveMeetings();
    console.log("roomsData:", roomsData);
    setRooms(roomsData);
    setLoading(false);
  };
  useEffect(() => {
    console.log("fetch test", rooms, loading);
    if (!rooms && !loading) {
      fetchRooms();
    }
  }, [loading, rooms]);
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center text-2xl font-bold">Game lobby</h1>
          <div className="flex justify-center items-center space-y-2 flex-col">
            <CreateGame />

            <p className="text-center text-sm">Or you can join one of the active games below</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8 p-4">
          {rooms?.map(({ roomId }: RoomInfo) => (
            <RoomCard key={roomId} roomId={roomId} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Lobby;
