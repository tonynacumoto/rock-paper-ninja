import Room from "./components/Room";

export default async function Page({ params }: { params: { room: string } }) {
  return (
    <main className="flex p-12">
      <Room roomId={params.room} />
    </main>
  );
}
