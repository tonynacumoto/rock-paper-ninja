import { createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

/**
 * @dev Creates an account from a private key.
 * @param {string} privateKey - The private key to create the account.
 * @returns {object} - The account created from the private key.
 */
export const getAccountFromPrivateKey = () => {
  const account = privateKeyToAccount(process.env.NEXT_PUBLIC_OWNER_PK as `0x${string}`);
  return account;
};

/**
 * @dev Creates a public client with a custom account.
 * @param {string} privateKey - The private key for the custom account.
 * @param {string} providerUrl - The URL of the provider to connect the account.
 * @returns {object} - The public client created with the custom account.
 */
export const getClientWithAccount = (providerUrl: string | undefined) => {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(providerUrl),
  });
  return client;
};
