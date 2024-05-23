import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const res = await request.json();
  const wallet = res.wallet;
  const response = await fetch("https://api.huddle01.com/api/v1/create-room", {
    method: "POST",
    body: JSON.stringify({
      title: "Huddle01-Test",
      hostWallets: [wallet],
    }),
    headers: {
      "Content-type": "application/json",
      "x-api-key": process.env.HUDDLE_API_KEY as string,
    },
  });

  const data = await response.json();

  return NextResponse.json(data.roomId);
}
