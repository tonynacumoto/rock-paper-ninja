"use client";

import { Content } from "~~/components/Content";
import { MessageProvider } from "~~/providers/Message/MessageProvider";
import { SocketProvider } from "~~/providers/Socket/SocketProvider";
import { UsersProvider } from "~~/providers/Users/UsersProvider";

export default function Page({ params }: { params: { room: string } }) {
  return (
    <main className="flex min-h-screen p-24">
      <SocketProvider room={params.room}>
        <UsersProvider>
          <MessageProvider>
            <Content room={params.room} />
          </MessageProvider>
        </UsersProvider>
      </SocketProvider>
    </main>
  );
}
