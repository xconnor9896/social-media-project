import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { baseURL } from "./util/auth";
import { parseCookies } from "nookies";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Segment, Divider, Header, Comment, Grid } from "semantic-ui-react";

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
    if (!socket.current) {
      socket.current = io(baseURL);
    }

    if(socket.current) {
      socket.current.emit('pingServer', {name: 'Porter', age: '29'})
    }
  }, []);

  return <div>messages</div>;
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
