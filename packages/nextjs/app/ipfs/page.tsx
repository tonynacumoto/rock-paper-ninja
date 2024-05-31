"use client";

import React, { useEffect, useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";

const IpfsPage: React.FC = () => {
  const [fileInfo, setFileInfo] = useState(null);
  const [cid, setCid] = useState(null);
  const [response, setResponse] = useState(null);
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const text = JSON.stringify({
        id: "gameId",
        winner: "player1Address",
        loser: "player2Address",
        winnerHands: [1, 1, 1, 2, 1, 3],
        loserHands: [3, 1, 1, 3, 1, 2],
        date: "timestamp",
      });
      const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE;
      const name = "shikamaru"; //Optional

      const response = await lighthouse.uploadText(text, apiKey, name);
      const cid = response.data.Hash;
      const fileInfo = await lighthouse.getFileInfo(cid);

      // Fetch the JSON data from the IPFS gateway
      const jsonRes = await fetch(`https://gateway.lighthouse.storage/ipfs/${cid}`);
      const jsonData = await jsonRes.json();

      console.log("This is the json fileInfo", jsonData);
      console.log("This is the fileInfo", fileInfo);
      console.log("This is the cid", cid);
      console.log("This the the lighthouse response", response);

      setFileInfo(fileInfo);
      setCid(cid);
      setResponse(response);
      setJsonData(jsonData);
    };

    fetchData();
  }, []);

  return (
    <main>
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">IPFS Integration</h1>
        <p className="text-neutral">
          Store and retrieve data from IPFS filecoin.
          <br /> Check{" "}
          <code className="italic bg-base-300 text-base font-bold [word-spacing:-0.5rem] px-1">
            packages / nextjs / app / ipfs / page.tsx
          </code>{" "}
        </p>
      </div>
    </main>
  );
};

export default IpfsPage;