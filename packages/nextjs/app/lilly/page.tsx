"use client";

import React, { FormEvent, useState } from "react";
import Image from "next/image";
import lighthouse from "@lighthouse-web3/sdk";
import { decodeEventLog } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
// import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

const LillyPage: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");
  const [lightHouseURL, setLightHouseURL] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ipfsCid, setIpfsCid] = useState<string>("");
  const [tokenID, setTokenID] = useState<bigint>(0);
  const [address, setAddress] = useState<string>("");
  const publicClient = usePublicClient();
  // Mint the NFT
  const { NFT } = getAllContracts();
  const { writeContractAsync: writeTokenURI } = useScaffoldWriteContract("NFT");
  const { address: addressWagmi } = useAccount();

  const handleMint = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    // Mint the NFT after the image is uploaded to IPFS
    const txHash = await scMintNFT(ipfsCid);
    const receipt = await publicClient?.waitForTransactionReceipt({ hash: txHash });
    let topics;
    try {
      topics = decodeEventLog({
        abi: NFT.abi,
        data: receipt?.logs[1].data,
        topics: receipt?.logs[1].topics,
      });
      setTokenID(topics?.args?._tokenId);
      console.log("id", tokenID);
    } catch (error) {
      console.error("error in decode", error);
    }
  };

  //Read the contract data.
  // const { data: tokenURI } = useScaffoldReadContract({
  //   contractName: "NFT",
  //   functionName: "tokenURI",
  //   args: [tokenID], // Replace 'bigIntId' with the ID of the minted NFT
  // });
  // console.log('tokenURI', tokenURI);

  //Added test comment

  const scMintNFT = async (ipfsCid: string) => {
    // Create the metadata for the NFT
    console.log("ipfsCid", ipfsCid);
    const metadata = {
      description: "Lilypad Image NFT",
      image: `https://gateway.lighthouse.storage/ipfs/${ipfsCid}`,
      name: imageName,
      attributes: [], // Add any attributes you want here
    };
    const addressToMint = address || addressWagmi;
    const txHash = await writeTokenURI({
      functionName: "mint",
      args: [addressToMint, JSON.stringify(metadata)], // Replace 'address' with the address of the NFT recipient
    });
    // console.log('addressWagmi', addressWagmi);
    // console.log('write res', txHash);
    return txHash;
  };

  // Console.log loading percentage
  const progressCallback = progressData => {
    const percentageDone = 100 - Number((progressData?.total / progressData?.uploaded)?.toFixed(2));
    console.log(percentageDone);
  };

  //IPFS hack for lillypad to get file from local url
  const getFileFromUrl = async (url: RequestInfo | URL) => {
    const response = await fetch(url);
    const data = await response.blob();
    const file = new File([data], "filename", { type: data.type });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    const fileList = dataTransfer.files;

    return fileList;
  };

  const uploadFile = async (file: FileList) => {
    const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE;
    console.log("Uploading file:", file);
    try {
      const output = await lighthouse.upload(file, apiKey, false, null, progressCallback);
      console.log("File Status:", output);
      console.log("Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash);
      const jsonIpfsCid = output.data.Hash;
      setIpfsCid(jsonIpfsCid);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const response = await fetch("http://localhost:3001/api/cliWrapper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }),
      });

      // Generate the URL to view the file
      const imageURL = await response.text();
      setOutput(imageURL);
      console.log("Image URL", imageURL);
      console.log("ImageName", imageName);

      // Upload the image to IPFS
      const fileList = await getFileFromUrl(imageURL);
      // const ipfsCid = await uploadFile(fileList);
      uploadFile(fileList);
      console.log("IPFS CID", ipfsCid);
      //Some reason the setLighthouseURL not working and could be fixed but not important.
      setLightHouseURL("Visit at https://gateway.lighthouse.storage/ipfs/" + ipfsCid);
      console.log("LightHouse URL", lightHouseURL);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false); // End loading
  };

  return (
    <main>
      <div className="flex min-h-screen flex-col items-center p-12">
        <div className="z-10 max-w-full w-full flex flex-col items-center justify-center font-mono text-sm space-y-4">
          <h1 className="text-4xl mb-4">Lilypad Image Generator</h1>
          <div className="w-full flex flex-col items-center">
            {!output && (
              <div className="border-dashed border-2 border-gray-300 w-full h-full flex items-center justify-center">
                {isLoading ? (
                  <span className="text-gray-500">Loading...</span>
                ) : (
                  <span className="text-gray-500">Image will appear here</span>
                )}
              </div>
            )}
            {output && <Image src={output} alt="Generated" layout="responsive" width={100} height={100} />}
            <form onSubmit={handleSubmit} className="w-full mt-2">
              <input
                className="w-full p-2 mb-2"
                value={imageName}
                onChange={e => setImageName(e.target.value)}
                placeholder="Enter image name"
              />
              <textarea
                className="w-full p-2 mb-2"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="Enter your prompt"
                rows={4}
              />
              {/* Add a new input for the NFT recipient's address */}
              <input
                className="w-full p-2 mb-2"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Enter recipient's address"
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="mt-4 bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Generate NFT
                </button>
                <button
                  onClick={handleMint}
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                >
                  Mint NFT
                </button>
              </div>
            </form>
            {/* Display the token URI */}
            {/* {tokenURI && <p>Token URI: {tokenURI}</p>} */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default LillyPage;
