import Image from "next/image";
import { TMessage } from "./ChatBox";
import { useLocalPeer } from "@huddle01/react/hooks";

interface Props {
  message: TMessage;
}

function LocalMessageBubble({ message }: Props) {
  const { metadata } = useLocalPeer<{ displayName: string }>();

  return (
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Image alt="Tailwind CSS chat bubble component" src="/challenger.png" width={100} height={100} />
        </div>
      </div>
      <div className="chat-header">{metadata?.displayName}</div>
      <div className="chat-bubble">{message.text}</div>
    </div>
  );
}

export default LocalMessageBubble;
