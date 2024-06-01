"use server";

import { API } from "@huddle01/server-sdk/api";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";

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

export async function generateAccessToken(roomId: string, role: Role = Role.CO_HOST) {
  const accessToken = new AccessToken({
    apiKey: process.env.HUDDLE_API_KEY as string,
    roomId,
    //available roles: Role.HOST, Role.CO_HOST, Role.SPEAKER, Role.LISTENER, Role.GUEST - depending on the privileges you want to give to the user
    role,
    //custom permissions give you more flexibility in terms of the user privileges than a pre-defined role
    permissions: {
      admin: true,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: true,
        screen: true,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    },
  });

  const token = accessToken.toJwt();
  return token;
}

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
