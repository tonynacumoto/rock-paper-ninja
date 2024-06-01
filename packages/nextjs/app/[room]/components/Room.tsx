"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import ChatBox from "./ChatBox/ChatBox";
import RemotePeer from "./RemotePeer";
import { useLocalAudio, useLocalPeer, useLocalVideo, usePeerIds, useRoom } from "@huddle01/react/hooks";
import { useAccount, useEnsName } from "wagmi";

export default function Room({ roomId }: { roomId: string }) {
  const { address, isConnected } = useAccount();
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

  const getToken = async () => {
    const tokenResponse = await fetch(`/api/huddle/token?roomId=${roomId}`);
    const token = await tokenResponse.text();
    return token;
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!isConnected) {
    return (
      <div>
        <p className="text-center">Press connect button in the navigation</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto w-full">
      <div className="w-full">
        <p className="badge badge-neutral">
          <code className="font-mono font-bold">{state}</code>
        </p>
        <div className="flex gap-2 justify-center">
          {state === "idle" && (
            <>
              <button
                disabled={!displayName}
                type="button"
                className="btn btn-primary"
                onClick={async () => {
                  const token = await getToken();
                  await joinRoom({
                    roomId,
                    token,
                  });
                }}
              >
                Join match
              </button>
            </>
          )}
        </div>
      </div>

      {state === "connected" && (
        <div className="grid grid-cols-1 gap-4">
          <div className="flex-1 justify-between items-center flex flex-col">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative flex gap-2">
                {isVideoOn ? (
                  <div className="mx-auto border-2 rounded-xl border-black relative">
                    <video ref={videoRef} className="aspect-video rounded-xl" autoPlay muted />
                    <div className="absolute right-5 bottom-5 flex gap-4">
                      <button
                        type="button"
                        className="btn btn-neutral"
                        onClick={async () => {
                          isVideoOn ? await disableVideo() : await enableVideo();
                        }}
                      >
                        {isVideoOn ? "Disable Video" : "Enable Video"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-neutral"
                        onClick={async () => {
                          isAudioOn ? await disableAudio() : await enableAudio();
                        }}
                      >
                        {isAudioOn ? "Disable Audio" : "Enable Audio"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="card card-compact bg-base-100 shadow-xl image-full">
                    <figure>
                      <Image
                        src={"/challenger.png"}
                        alt="background"
                        height={300}
                        width={533}
                        className="aspect-video"
                      />
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title">You</h2>
                      <p>{displayName}</p>
                      <div className="card-actions justify-end">
                        <button
                          type="button"
                          className="btn btn-neutral"
                          onClick={async () => {
                            isVideoOn ? await disableVideo() : await enableVideo();
                          }}
                        >
                          {isVideoOn ? "Disable Video" : "Enable Video"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-neutral"
                          onClick={async () => {
                            isAudioOn ? await disableAudio() : await enableAudio();
                          }}
                        >
                          {isAudioOn ? "Disable Audio" : "Enable Audio"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="">
                {peerIds.map(peerId => (peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null))}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-2/3">Game goes here</div>
            <ChatBox />
          </div>
        </div>
      )}
    </div>
  );
}
