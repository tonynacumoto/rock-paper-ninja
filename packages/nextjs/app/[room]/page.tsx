import { generateAccessToken } from "../actions";
import Room from "./components/Room";
import { Role } from "@huddle01/server-sdk/auth";

export default async function Page({ params }: { params: { room: string } }) {
  const token = await generateAccessToken(params.room, Role.CO_HOST);

  return (
    <main className="flex min-h-screen p-24">
      <Room roomId={params.room} token={token} />
    </main>
  );
}
