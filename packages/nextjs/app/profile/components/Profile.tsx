"use client";

import Image from "next/image";
import Link from "next/link";
import { useAccount } from "wagmi";

// import ENS from "~~/components/ENS";

export default function Profile() {
  const { isConnected } = useAccount();
  if (!isConnected) {
    return <div>Connect wallet in the header</div>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="flex gap-3 items-center">
        <div className="avatar">
          <div className="w-12 rounded-full">
            <Image src="/logo.png" width={100} height={100} alt="logo" />
          </div>
        </div>
        <p className="text-md">
          You can create an NFT avatar using Lilypad for you here: <Link href="/lilypad">Create Avatar</Link>
        </p>
      </div>
      <h2 className="text-xl font-bold">Stats</h2>
      <div className="stats shadow">
        <div className="stat place-items-center">
          <div className="stat-title">Wins</div>
          <div className="stat-value">31K</div>
          <div className="stat-desc">From January 1st to February 1st</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Wins</div>
          <div className="stat-value">29K</div>
          <div className="stat-desc text-success">↗︎ 40 (2%)</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Losses</div>
          <div className="stat-value">1,200</div>
          <div className="stat-desc text-error">↘︎ 90 (14%)</div>
        </div>
      </div>
      {/* <ENS /> */}
    </div>
  );
}
