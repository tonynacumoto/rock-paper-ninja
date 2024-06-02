"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { set } from "nprogress";


export default function Profile() {
  const [username, setUsername] = useState("");
  const { isConnected } = useAccount();
  const { address: addressWagmi } = useAccount();
  const [lastNFT, setLastNFT] = useState(BigInt(0));
  const [tokenURI, setTokenURI] = useState(null);
  const [imageSrc, setImageSrc] = useState("");

  const tokenListResult = useScaffoldReadContract({
    contractName: "NFT",
    functionName: "tokensOfOwner",
    args: [addressWagmi],
  });

  useEffect(() => {
    if (tokenListResult.data) {
      console.log("tokenList Size", tokenListResult.data?.length);
      console.log('tokenList', tokenListResult.data);

      if (tokenListResult.data.length > 0) {
        const lastNFT = tokenListResult.data[tokenListResult.data.length - 1];
        setLastNFT(lastNFT);
      }
    }
  }, [tokenListResult]);

  const tokenURIResult = useScaffoldReadContract({
    contractName: "NFT",
    functionName: "tokenURI",
    args: [lastNFT],
  });

  useEffect(() => {
    if (tokenURIResult.data) {
      const tokenData = JSON.parse(tokenURIResult.data);
      console.log('tokenURI', tokenURIResult.data);
      setTokenURI(tokenURIResult.data);
      setImageSrc(tokenData.image);
    }
  }, [tokenURIResult]);
  console.log('tokenURI', tokenURI);
  console.log('imageSrc', imageSrc);

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
          <div className="w-24 rounded-full">
            {imageSrc ? (
              <Image src={imageSrc} width={100} height={100} alt="logo" />
            ) : (
              // Render a placeholder image or nothing at all
              <Image src="/logo.png" width={100} height={100} alt="logo" />
            )}
          </div>
        </div>
        <p className="text-md">
          You can create an NFT avatar using Lilypad for you here:
          <Link href="/lilly">
            <div className="btn btn-ghost hover:bg-blue-500 hover:text-white transition-colors duration-200">
              Create Avatar
            </div>
          </Link>
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
        <div className="join">
          <div>
            <div>
              <input
                className="input input-bordered join-item"
                placeholder="Search"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
          </div>
          <button className="join-item bnt btn-ghost">.legt.ninja</button>
          <div className="indicator">
            <span className="indicator-item badge badge-secondary">new</span>
            <button className="btn join-item">Search</button>
          </div>
        </div>
      </form>
    </div>
  );
}
