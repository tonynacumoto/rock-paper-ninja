"use server";

import { API } from "@huddle01/server-sdk/api";

const api = new API({
  apiKey: process.env.HUDDLE_API_KEY as string,
});

export const createRoom = async () => {
  const createNewRoom = await api.createRoom({
    title: "Huddle01 Room",
  });

  const newRoomData = createNewRoom?.data;

  return newRoomData?.data.roomId;
};
export const getLiveMeetings = async () => {
  const liveMeetings = await api.getLiveMeetings();

  return liveMeetings.data?.liveMeetings;
};

export const getParticipantsList = async (meetingId: string) => {
  const participantsApiResponse = await fetch(
    `https://api.huddle01.com/api/v1/rooms/participant-list?meetingId=${meetingId}`,
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.HUDDLE_API_KEY as string,
      },
    },
  );
  const participantsApiJson = await participantsApiResponse.json();
  console.log(participantsApiJson);
  const participants = await api.getParticipants({
    meetingId,
  });
  console.log(participants);

  return participants?.data;
};
