// import React, { useState } from "react";
// import { encodePacked, keccak256 } from "viem";
// import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const EnsSubdomainManager = () => {
  // const domain = "legt.co";
  // // const [domain, setDomain] = useState("");
  // const [subdomain, setSubdomain] = useState("");
  // const [newOwner, setNewOwner] = useState("");

  // const { writeContractAsync: writeENSAsync } = useScaffoldWriteContract("ensRegistry");

  // const namehash = (name: string) => {
  //   let node = "0x" + "0".repeat(64);
  //   if (name) {
  //     const labels = name.split(".");
  //     for (let i = labels.length - 1; i >= 0; i--) {
  //       node = keccak256(
  //         encodePacked(["bytes32", "bytes32"], [node as `0x${string}`, keccak256(new TextEncoder().encode(labels[i]))]),
  //       );
  //     }
  //   }
  //   return node;
  // };

  // const addSubdomain = async () => {
  //   const domainHash = namehash(domain);
  //   const subdomainLabelHash = keccak256(new TextEncoder().encode(subdomain));

  //   try {
  //     //@ts-expect-error
  //     const tx = await writeENSAsync({
  //       functionName: "setSubnodeOwner",
  //       args: [domainHash, subdomainLabelHash, newOwner],
  //     });
  //     console.log("Transaction sent:", tx);
  //   } catch (error) {
  //     console.error("Error sending transaction:", error);
  //   }
  // };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">ENS Subdomain Manager</h2>
      {/* <input
        type="text"
        placeholder="legt.ninja"
        className="input input-bordered w-full mb-4"
        value={domain}
        onChange={e => setDomain(e.target.value)}
      /> */}
      <input
        type="text"
        placeholder="Subdomain (e.g., sub)"
        className="input input-bordered w-full mb-4"
        // value={subdomain}
        // onChange={e => setSubdomain(e.target.value)}
      />
      <input
        type="text"
        placeholder="New Owner Address"
        className="input input-bordered w-full mb-4"
        // value={newOwner}
        // onChange={e => setNewOwner(e.target.value)}
      />
      {/* <button className="btn btn-primary" onClick={addSubdomain}>
        Add Subdomain
      </button> */}
    </div>
  );
};

export default EnsSubdomainManager;
