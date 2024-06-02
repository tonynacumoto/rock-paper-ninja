import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const externalContracts = {
  // "31337": {
  //   ensRegistry: {
  //     address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e", // ENS Registry contract address
  //     abi: [
  //       {
  //         constant: false,
  //         inputs: [
  //           { name: "node", type: "bytes32" },
  //           { name: "label", type: "bytes32" },
  //           { name: "owner", type: "address" },
  //         ],
  //         name: "setSubnodeOwner",
  //         outputs: [{ name: "ret", type: "bytes32" }],
  //         payable: false,
  //         stateMutability: "nonpayable",
  //         type: "function",
  //       },
  //     ],
  //   },
  // },
  "1": {
    ensRegistry: {
      address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e", // ENS Registry contract address
      abi: [
        {
          constant: false,
          inputs: [
            { name: "node", type: "bytes32" },
            { name: "label", type: "bytes32" },
            { name: "owner", type: "address" },
          ],
          name: "setSubnodeOwner",
          outputs: [{ name: "ret", type: "bytes32" }],
          payable: false,
          stateMutability: "nonpayable",
          type: "function" as const,
        },
      ],
    },
  },
};
//@ts-expect-error
export default externalContracts satisfies GenericContractsDeclaration;
