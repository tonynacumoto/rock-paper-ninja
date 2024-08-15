"use server";

import { API } from "@huddle01/server-sdk/api";

const api = new API({
  apiKey: process.env.NEXT_PUBLIC_HUDDLE_API_KEY as string,
});

export const createRoom = async () => {
  console.log("creating room", api);
  const createNewRoom = await api.createRoom({
    title: "Huddle01 Room",
  });
  console.log("room created", createNewRoom);
  const newRoomData = createNewRoom?.data;
  console.log("newRoomData:", newRoomData);

  return newRoomData?.data.roomId;
  // return "123";
};
export const getLiveMeetings = async () => {
  console.log("getting live meetings");
  const liveMeetings = await api.getLiveMeetings();
  console.log("gotten", liveMeetings.data);
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
  console.log("participant list", participantsApiJson);
  const participants = await api.getParticipants({
    meetingId,
  });
  console.log(participants);

  return participants?.data;
};
