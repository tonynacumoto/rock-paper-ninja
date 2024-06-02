import Image from "next/image";
import Link from "next/link";

export default function RoomCard({ roomId }: { roomId: string }) {
  return (
    <Link href={`/${roomId}`}>
      <div className="card card-compact w-96 bg-base-100 shadow-xl">
        <figure>
          <Image src="/logo.png" width={600} height={300} alt="Logo" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{roomId}</h2>
          <p>This is a .1ETH game. Best 2/3</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Join</button>
          </div>
        </div>
      </div>
    </Link>
  );
}
