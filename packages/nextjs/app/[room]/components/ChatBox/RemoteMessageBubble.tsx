import { TMessage } from "./ChatBox";
import { useRemotePeer } from "@huddle01/react/hooks";

interface Props {
  message: TMessage;
}

function RemoteMessageBubble({ message }: Props) {
  const { metadata } = useRemotePeer<{ displayName: string }>({ peerId: message.sender });

  return (
    <div className="items-start bg-red-800 w-fit px-2 py-1 rounded-lg flex flex-col mt-1">
      <span className="text-gray-400 text-md">{metadata?.displayName}</span>
      <span className="text-white text-sm">{message.text}</span>
    </div>
  );
}

export default RemoteMessageBubble;
