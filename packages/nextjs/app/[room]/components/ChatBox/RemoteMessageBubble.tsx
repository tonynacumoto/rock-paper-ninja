import Image from "next/image";
import { TMessage } from "./ChatBox";
import { useRemotePeer } from "@huddle01/react/hooks";

interface Props {
  message: TMessage;
}

function RemoteMessageBubble({ message }: Props) {
  const { metadata } = useRemotePeer<{ displayName: string }>({ peerId: message.sender });

  return (
    <div className="chat chat-end">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Image alt="Tailwind CSS chat bubble component" src="/opponent.png" width={100} height={100} />
        </div>
      </div>
      <div className="chat-header">{metadata?.displayName}</div>
      <div className="chat-bubble">{message.text}</div>
    </div>
  );
}

export default RemoteMessageBubble;
