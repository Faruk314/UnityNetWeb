import React, {
  useEffect,
  useState,
  FormEvent,
  useRef,
  useContext,
} from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import profileDefault from "../../images/profile.jpg";
import { IoMdSend } from "react-icons/io";
import Message from "../../cards/Message";
import axios from "axios";
import { chatActions, fetchMessages } from "../../redux/chatSlice";
import { Chat as Ch } from "../../types/types";
import { SocketContext } from "../../context/SocketContext";

interface Props {
  chatInfo: Ch;
}

const Chat = ({ chatInfo }: Props) => {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const messages = useAppSelector((state) => state.chat.messages);
  const [messageSent, setMessageSent] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    dispatch(chatActions.deleteArrivedMessages());
  }, [dispatch]);

  const scrollChatWindow = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Add an event listener to the chat window to call the scroll function whenever a new message is added
    if (chatWindowRef.current) {
      chatWindowRef.current.addEventListener(
        "DOMNodeInserted",
        scrollChatWindow
      );
    }

    return () => {
      // Remove the event listener when the component is unmounted
      if (chatWindowRef.current) {
        chatWindowRef.current.removeEventListener(
          "DOMNodeInserted",
          scrollChatWindow
        );
      }
    };
  }, []);

  useEffect(() => {
    dispatch(fetchMessages(chatInfo.conversationId));
  }, [dispatch, chatInfo, messageSent]);

  const messageHandler = async (e: FormEvent) => {
    e.preventDefault();

    const msg = {
      conversation_id: chatInfo.conversationId,
      sender_id: loggedUserInfo.id,
      receiverId: chatInfo.userId,
      message,
      seen_at: null,
    };

    socket?.emit("sendMessage", msg);

    setMessage("");
    setMessageSent(true);

    try {
      await axios.post(
        `http://localhost:7000/api/messages/sendMessage/${loggedUserInfo.id}/${chatInfo.conversationId}`,
        { message }
      );

      setMessage("");
      setMessageSent(false);
    } catch (err) {}
  };

  return (
    <div className="fixed right-[4rem] bottom-0 ml-5 w-[18rem] bg-white h-[23rem] shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <div className="flex items-center justify-between bg-blue-600 h-[2.5rem] text-white rounded-t-md p-2">
        <div className="flex items-center space-x-2 font-bold">
          <img
            src={chatInfo.image || profileDefault}
            alt=""
            className="border-2 w-[2rem] h-[2rem] rounded-full"
          />
          <span>{chatInfo.firstName}</span>
          <span>{chatInfo.lastName}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(chatActions.closeChat(chatInfo.userId));
          }}
          className="text-[1.2rem]"
        >
          X
        </button>
      </div>

      <div
        ref={chatWindowRef}
        className="p-2 h-[17rem] overflow-y-scroll flex flex-col space-y-2"
      >
        {messages?.map((message, index) => (
          <Message
            key={message.id}
            messageId={message.id}
            message={message.message}
            id={message.sender_id}
            receiverId={chatInfo.userId}
            userImage={chatInfo.image}
            lastSeen={messages[index].seen_at}
            firstName={chatInfo.firstName}
            lastName={chatInfo.lastName}
          />
        ))}
      </div>

      <form
        onSubmit={(e) => messageHandler(e)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            messageHandler(e);
          }
        }}
        className="absolute bottom-0 flex items-center my-2 space-x-2"
      >
        <textarea
          placeholder="write something"
          onChange={(e) => setMessage(e.target.value)}
          rows={1}
          className="p-2 overflow-y-auto bg-gray-200 rounded-full focus:outline-none"
          value={message}
        />

        <button type="submit" className="">
          <IoMdSend size={30} className="text-blue-500" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
