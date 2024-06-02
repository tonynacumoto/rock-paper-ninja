import { defineChain } from "viem";

export const milkywayLillypad = /*#__PURE__*/ defineChain({
  id: 1337, // replace with the actual chainId
  name: "Milkyway Lillypad Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["http://testnet.lilypad.tech:8545"], // replace with the actual RPC URL
    },
  },
  blockExplorers: {
    default: {
      name: "Milkyway Explorer", // replace with the actual explorer name
      url: "", // replace with the actual explorer URL
      apiUrl: "", // replace with the actual explorer API URL
    },
  },
  contracts: {
    // Add any specific contracts here
  },
});
