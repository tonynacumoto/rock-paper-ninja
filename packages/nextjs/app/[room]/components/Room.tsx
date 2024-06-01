"use client";

import { useEffect, useRef } from "react";
import ChatBox from "./ChatBox/ChatBox";
import RemotePeer from "./RemotePeer";
import { useLocalAudio, useLocalPeer, useLocalVideo, usePeerIds, useRoom } from "@huddle01/react/hooks";
import { useAccount, useEnsName } from "wagmi";

export default function Room({ roomId, token }: { roomId: string; token: string }) {
  const { address } = useAccount();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { data: ensName } = useEnsName({ address });
  const displayName = ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}` || "Huddle01 User";
  const { joinRoom, state } = useRoom({
    onJoin: room => {
      console.log("onJoin", room);
      updateMetadata({ displayName });
    },
    onPeerJoin: peer => {
      console.log("onPeerJoin", peer);
    },
  });
  const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo();
  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();
  const { updateMetadata } = useLocalPeer<{ displayName: string }>();
  const { peerIds } = usePeerIds();

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <main className={`flex min-h-screen flex-col items-center p-4 w-full`}>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
        <p className="border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <code className="font-mono font-bold">{state}</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          {state === "idle" && (
            <>
              <button
                disabled={!displayName}
                type="button"
                className="bg-blue-500 p-2 mx-2 rounded-lg"
                onClick={async () => {
                  await joinRoom({
                    roomId,
                    token,
                  });
                }}
              >
                Join Room
              </button>
            </>
          )}

          {state === "connected" && (
            <>
              <button
                type="button"
                className="bg-blue-500 p-2 mx-2 rounded-lg"
                onClick={async () => {
                  isVideoOn ? await disableVideo() : await enableVideo();
                }}
              >
                {isVideoOn ? "Disable Video" : "Enable Video"}
              </button>
              <button
                type="button"
                className="bg-blue-500 p-2 mx-2 rounded-lg"
                onClick={async () => {
                  isAudioOn ? await disableAudio() : await enableAudio();
                }}
              >
                {isAudioOn ? "Disable Audio" : "Enable Audio"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="w-full mt-8 flex gap-4 justify-between items-stretch">
        <div className="flex-1 justify-between items-center flex flex-col">
          <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
            <div className="relative flex gap-2">
              {isVideoOn && (
                <div className="w-1/2 mx-auto border-2 rounded-xl border-blue-400">
                  <video ref={videoRef} className="aspect-video rounded-xl" autoPlay muted />
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 mb-32 grid gap-2 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
            {peerIds.map(peerId => (peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null))}
          </div>
        </div>
        {state === "connected" && <ChatBox />}
      </div>
    </main>
  );
}
