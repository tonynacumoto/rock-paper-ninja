"use client";

import React from "react";
// @ts-ignore
import { Audio, Video } from "@huddle01/react/components";
import { useRemoteAudio, useRemoteVideo } from "@huddle01/react/hooks";

type Props = {
  peerId: string;
};

const RemotePeer = ({ peerId }: Props) => {
  const { stream } = useRemoteVideo({ peerId });
  const { stream: audioStream } = useRemoteAudio({ peerId });

  return (
    <div className="flex flex-col gap-2">
      {stream && <Video stream={stream} className="border-2 rounded-xl border-white-400 aspect-video" />}
      {audioStream && <Audio stream={audioStream} />}
    </div>
  );
};

export default React.memo(RemotePeer);
