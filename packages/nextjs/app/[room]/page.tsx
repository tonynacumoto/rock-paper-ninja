import Room from "./components/Room";

export default async function Page({ params }: { params: { room: string } }) {
  return (
    <main className="flex min-h-screen p-12">
      <Room roomId={params.room} />
    </main>
  );
}
