import Room from "./components/Room";

export default async function Page({ params }: { params: { room: string } }) {
  const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/huddle/token?roomId=${params.room}`);
  const tokenData = (await tokenResponse.json()) as { token: string };
  const { token } = tokenData;

  return (
    <main className="flex min-h-screen p-24">
      <Room roomId={params.room} token={token} />
    </main>
  );
}
