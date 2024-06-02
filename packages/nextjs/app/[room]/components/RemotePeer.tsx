"use client";

import React from "react";
import Image from "next/image";
// @ts-ignore
import { Audio, Video } from "@huddle01/react/components";
import { useRemoteAudio, useRemotePeer, useRemoteVideo } from "@huddle01/react/hooks";

type Props = {
  peerId: string;
};

const RemotePeer = ({ peerId }: Props) => {
  const { stream } = useRemoteVideo({ peerId });
  const { metadata } = useRemotePeer<{
    displayName: string;
  }>({ peerId });
  const { stream: audioStream } = useRemoteAudio({ peerId });

  return (
    <div className="flex flex-col gap-2">
      {stream ? (
        <Video stream={stream} className="border-2 rounded-xl border-red-500 aspect-video" />
      ) : (
        <div className="card card-compact bg-base-100 shadow-xl image-full border-red-800 border-2 rounded-xl">
          <figure>
            <Image src={"/opponent.png"} alt="background" height={300} width={533} className="aspect-video" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Your opponent</h2>
            <p>{metadata && metadata.displayName}</p>
          </div>
        </div>
      )}
      {audioStream && <Audio stream={audioStream} />}
    </div>
  );
};

export default React.memo(RemotePeer);
