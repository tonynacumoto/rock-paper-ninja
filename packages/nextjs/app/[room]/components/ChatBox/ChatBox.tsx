import { useState } from "react";
import LocalMessageBubble from "./LocalMessageBubble";
import RemoteMessageBubble from "./RemoteMessageBubble";
import { useDataMessage, useLocalPeer } from "@huddle01/react/hooks";

export type TMessage = {
  text: string;
  sender: string;
};

function ChatBox() {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [text, setText] = useState<string>("");

  const { peerId } = useLocalPeer();
  const { sendData } = useDataMessage({
    onMessage: (payload, from, label) => {
      if (label === "chat") {
        setMessages(prev => [...prev, { text: payload, sender: from }]);
      }
      if (label === "server-message") {
        console.log("Recording", JSON.parse(payload)?.s3URL);
      }
    },
  });

  const sendMessage = () => {
    sendData({
      to: "*",
      payload: text,
      label: "chat",
    });
    setText("");
  };

  return (
    <div className="card card-compact w-1/3 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Chat room</h2>
        <div className=" min-h-48 mb-4 flex flex-col gap-2 max-h-96 overflow-y-scroll">
          {messages.map((message, index) =>
            message.sender === peerId ? (
              <div className="w-full self-end" key={index}>
                <LocalMessageBubble message={message} />
              </div>
            ) : (
              <div className="w-full self-start" key={index}>
                <RemoteMessageBubble key={index} message={message} />
              </div>
            ),
          )}
        </div>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          placeholder="Type Message..."
          value={text}
          onChange={event => setText(event.target.value)}
          onKeyDown={event => {
            if (event.key === "Enter") {
              sendMessage();
            }
          }}
        />
      </div>
    </div>
  );
}

export default ChatBox;
