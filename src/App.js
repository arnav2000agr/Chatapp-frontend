import { useEffect, useState } from "react";
import io from "socket.io-client";
import { v4 } from "uuid";
import "../src/App.css";
import logo from './Assets/chat.png'
// const PORT = 3001;

// const socket = io(`https://chatbackend-waq2.onrender.com`);
var socket = io('https://chatbackend-waq2.onrender.com');

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  const [chatIsVisible, setChatIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    console.log("connected:", socket.connected);
    socket.on("connect", () => {
    
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [isConnected]);
  // var inp = document.getElementById('inp');
  // if(inp){
  //   inp.addEventListener('keypress', function (e) {
  //     if (e.key === 'Enter') {
  //       e.preventDefault();
  //       document.getElementById("button2").click();
  //     }
  // });
    
  // }

 

  useEffect(() => {
    socket.on("receive_msg", ({ user, message }) => {
      const msg = `${user} sent: ${message}`;
      setMessages((prevState) => [msg, ...prevState]);
    });
  }, [socket]);

  const handleEnterChatRoom = () => {
    if (user !== "" && room !== "") {
      alert("Welcome to chatroom!")
      alert("You can use chatroom to chat to your crush while letting your bestfriend read your chats live! No screenshots required!Just share your room number with them")
      setChatIsVisible(true);
      socket.emit("join_room", { user, room });
    }
  };

  const handleSendMessage = () => {
    if(newMessage==="")
    alert("Message box empty")
    else{
    const newMsgData = {
      room: room,
      user: user,
      message: newMessage,
    };
    socket.emit("send_msg", newMsgData);
    const msg = `${user} sent: ${newMessage}`;
    setMessages((prevState) => [msg, ...prevState]);
    setNewMessage("");
  }
  };
 
  return (
    <>
    <div>
    <img  className="logo" src={logo} height="50" width="50"/>

    </div>
    
    <div className="main-container" >
      {!chatIsVisible ? (
        <>
          <input
            className="input"
            type="text"
            placeholder="User"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <br />
          <input
            className="input"
            type="text"
            placeholder="Room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <br />
          <button className="button" onClick={handleEnterChatRoom}>Enter</button>
        </>
      ) : (
        <>
          <h5 className="text">
            Room: {room} | User : {user}
          </h5>
          <div
            style={{
              height: 200,
              width: 250,
              color:"white",
              border: "1px solid white",
              overflowY: "scroll",
              marginbottom: 10,
              padding: 18,
            
            }}
          >
            {messages.map((el) => (
              <div key={v4()}>{el}</div>
            ))}
          </div>
          <input
            id="inp"
            type="text"
            placeholder="message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button id="button2" onClick={handleSendMessage}>&#x21b3;</button>
        </>
      )}
    </div>
    </>
  );
}

export default App;
