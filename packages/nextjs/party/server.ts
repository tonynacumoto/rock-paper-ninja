import * as serverConnections from "../providers";
import { PartyKitExtended, PartyKitServerWithMoreFun } from "./extended";

const connections = Object.values(serverConnections.default);

export default {
  ...PartyKitExtended,
  async onConnect(conn, room) {
    for (const connection of connections) {
      if (connection.onConnect) {
        await connection.onConnect(conn, room);
      }
    }
  },

  async onClose(conn, room) {
    for (const connection of connections) {
      if (connection.onClose) {
        await connection.onClose(conn, room);
      }
    }
  },

  async onMessage(msg, conn, room) {
    for (const connection of connections) {
      if (connection.onMessage) {
        await connection.onMessage(msg, conn, room);
      }
    }
  },
} satisfies PartyKitServerWithMoreFun;
