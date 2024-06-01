import { createClient } from "@vercel/kv";

const store = createClient({
  url: process.env.NEXT_PUBLIC_KV_REST_API_URL,
  token: process.env.NEXT_PUBLIC_KV_REST_API_TOKEN,
});
export const setStore = async ({ key, data }: { key: string; data: object }) => {
  try {
    const value = await store.set(key, data);
    return value;
  } catch (error) {
    // Handle errors
    console.log("error setting to KV store", error);
  }
};

export const getStore = async ({ key }: { key: string }) => {
  try {
    const match = await store.get(key);
    return match;
  } catch (error) {
    // Handle errors
    console.log("error getting from KV store", error);
  }
};
