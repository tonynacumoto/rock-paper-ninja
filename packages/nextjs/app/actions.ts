"use server";

export const createRoom = async () => {
  const response = await fetch("https://api.huddle01.com/api/v1/create-room", {
    method: "POST",
    body: JSON.stringify({
      title: "Huddle01 Room",
    }),
    headers: {
      "Content-type": "application/json",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      "x-api-key": process.env.HUDDLE_API_KEY!,
    },
    cache: "no-cache",
  });

  const data = await response.json();
  const roomId = data.data.roomId;
  return roomId;
};

export const getAllRooms = async () => {
  const response = await fetch("https://api.huddle01.com/api/v1/get-rooms", {
    headers: {
      "Content-type": "application/json",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      "x-api-key": process.env.HUDDLE_API_KEY!,
    },
    cache: "no-cache",
  });
  const data = await response.json();
  return data.rooms;
};

export const getPreviewPeers = async (roomId: string) => {
  const response = await fetch(`https://api.huddle01.com/api/v1/live-meetings/preview-peers?roomId=${roomId}`, {
    headers: {
      "Content-type": "application/json",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      "x-api-key": process.env.HUDDLE_API_KEY!,
    },
    cache: "no-cache",
  });
  const data = await response.json();
  if (data.previewPeers) {
    return data.previewPeers;
  }
  return [];
};
