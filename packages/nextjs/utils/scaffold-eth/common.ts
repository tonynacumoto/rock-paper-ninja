// To be used in JSON.stringify when a field might be bigint
// https://wagmi.sh/react/faq#bigint-serialization
export const replacer = (_key: string, value: unknown) => (typeof value === "bigint" ? value.toString() : value);

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const isZeroAddress = (address: string) => address === ZERO_ADDRESS;
export const cleanBigIntData = (rawData: any[] | readonly [bigint, number, string, string, bigint, boolean, string]) =>
  rawData.map(item => (typeof item === "bigint" ? BigInt(item).toString() : item));

export const shortenHash = (hash: string | undefined) => {
  if (!hash) return;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};
