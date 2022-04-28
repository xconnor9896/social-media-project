import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { baseURL } from "./util/auth";
import { parseCookies } from "nookies";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Segment, Divider, Header, Comment, Grid } from "semantic-ui-react";
import ChatListSearch from "./components/chat/ChatListSearch";
import Chat from "./components/chat/Chat";
import Banner from "./components/messages/Banner";

const scrollDivToBottom = (divRef) =>
  divRef.current !== null &&
  divRef.current.scrollIntoView({ behavior: "smooth" });

const messages = ({ chatsData, user }) => {
  const [chats, setChats] = useState(chatsData);
  const router = useRouter();

  const socket = useRef();
  const [connectedUsers, setConnectedUsers] = useState([]);

  const [messages, setMessages] = useState([]);
  const [bannerData, setBannerData] = useState({ name: "", profilePicURL: "" });

  const divRef = useRef();
  const openChatId = useRef("");

  useEffect(() => {
    startServer();
  }, []);

  const startServer = async () => {
    await fetch("/api/socket");
    socket.current = io();

    socket.current.on("connect", () => {
      console.log("connected");
    });

    socket.current.on("connectedUsers", ({ users }) => {
      users.length > 0 && setConnectedUsers(users);
    });

    socket.current.emit("join", { userId: user._id });
  };

  useEffect(() => {
    const loadMessages = () => {
      socket.current.emit("loadMessages", {
        userId: user._id,
        messagesWith: router.query.message,
      });
    };
    if (socket.current && router.query.message) loadMessages();
  }, [router.query.message]);

  const deleteChat = async (messagesWith) => {
    try {
      await axios.delete(`${baseURL}/api/v1/messages/${messagesWith}`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });

      setChats((prev) =>
        prev.filter((chat) => chat.messagesWith !== messagesWith)
      );
      router.push("/messages", undefined, { shallow: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Segment>
      <Header
        icon="home"
        content="Go Back"
        onClick={() => router.push("/")}
        style={{ cursor: "pointer" }}
      />
      <Divider hidden />
      <div style={{ marginTop: "10px" }}>
        <ChatListSearch chats={chats} setChats={setChats} />
      </div>
      {chats.length > 0 ? (
        <>
          <Grid stackable>
            <Grid.Column width={4}>
              <Comment.Group size="big">
                <Segment
                  raised
                  style={{ overflow: "auto", maxHeight: "32rem" }}
                >
                  {chats.map((chat, i) => (
                    <Chat
                      chat={chat}
                      connectedUsers={connectedUsers}
                      deletechat={deleteChat}
                    />
                  ))}
                </Segment>
              </Comment.Group>
            </Grid.Column>
            <Grid.Column width={14}>
              {router.query.message && (
                <>
                  <div
                    style={{
                      overflow: "auto",
                      overflowX: "hidden",
                      maxHeight: "32rem",
                      height: "32rem",
                      backgroundColor: "whitesmoke",
                    }}
                  >
                    <div style={{ position: "sticky", top: "0" }}>
                      <Banner bannerData={bannerData} />
                    </div>
                    {messages.length > 0 &&
                      messages.map((message, i) => <p>Message Component</p>)}
                  </div>

                  <p>Message Input Component</p>
                </>
              )}
            </Grid.Column>
          </Grid>
        </>
      ) : (
        <p>No Chats</p>
      )}
    </Segment>
  );
};

messages.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);
    const res = await axios.get(`${baseURL}/api/v1/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { chatsData: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default messages;
