import { Server } from "socket.io";
import { io } from "socket.io-client";
import ChatModel from "../../server/models/ChatModel";

const users = [];

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running!");
  } else {
    console.log("Socket initializing...");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("join", async ({ userId }) => {
        console.log(userId);

        const user = users.find((user) => user.userId === userId);

        if (!user) users.push({ userId });

        setInterval(() => {
          socket.emit("connectedUsers", {
            users: users.filter((user) => user.userId !== userId),
          });
        }, 10000);
      });

      socket.on("loadMessages", async ({ userId, messagesWith }) => {
        const user = await ChatModel.findOne({ user: userId }).populate(
          "chats.messagesWith"
        );
        const chat = user.chats.find(
          (chat) => chat.messagesWith._id.toString() === messagesWith
        );

        if (!chat) socket.emit("noChatFound");
        else socket.emit("messagesLoaded", { chat });

        return { chat };
      });
    });
  }
  res.end();
};

export default SocketHandler;
