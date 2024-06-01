import { TMessage } from "./ChatBox";
import { useLocalPeer } from "@huddle01/react/hooks";

interface Props {
  message: TMessage;
}

function LocalMessageBubble({ message }: Props) {
  const { metadata } = useLocalPeer<{ displayName: string }>();

  return (
    <div className="items-start bg-black w-fit px-2 py-1 rounded-lg flex flex-col mt-1">
      <span className="text-gray-400 text-md">{metadata?.displayName}</span>
      <span className="text-white text-sm">{message.text}</span>
    </div>
  );
}

export default LocalMessageBubble;
