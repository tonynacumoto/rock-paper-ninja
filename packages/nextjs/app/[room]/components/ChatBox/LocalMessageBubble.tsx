import { TMessage } from "./ChatBox";
import { useLocalPeer } from "@huddle01/react/hooks";

interface Props {
  message: TMessage;
}

function LocalMessageBubble({ message }: Props) {
  const { metadata } = useLocalPeer<{ displayName: string }>();

  return (
    <div className="w-full items-end flex flex-col rounded-lg">
      <span className="text-blue-400 text-md">{metadata?.displayName}</span>
      <span className="text-white bg-blue-500 p-1 rounded-lg text-sm">{message.text}</span>
    </div>
  );
}

export default LocalMessageBubble;
