"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function Profile() {
  const [username, setUsername] = useState("");
  const { isConnected } = useAccount();
  if (!isConnected) {
    return <div>Connect wallet in the header</div>;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(username);
  }
  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="flex gap-3 items-center">
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
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
      <h2 className="text-xl font-bold">Your username</h2>
      <p className="text-md">You can set your username here using ENS</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <button type="submit" className="btn btn-primary">
          Check availability
        </button>
      </form>
    </div>
  );
}
