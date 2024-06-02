import Room from "../[room]/components/Room";

export default async function EscrowPage({
  params,
  searchParams,
}: {
  params: { escrowId: string };
  searchParams: { room: string };
}) {
  return (
    <main className="flex p-12">
      <Room roomId={searchParams.room} escrowId={Number(params.escrowId)} />
    </main>
  );
}
