import React, { useState } from "react";
import styles from "./Components.module.scss";
import Input from "./input";
import Peer from "peerjs";
let uniqueID = Math.floor(
  Math.random(Date.UTC()) * Math.floor(Math.pow(10, 12))
);
let peer = new Peer({
  secure: true,
  host: "peernexjs.herokuapp.com",
  port: 443,
});
uniqueID = peer.id;
let setCallingStatusG = null;
let setCalleeG = null;
const initSignal = () => {
  console.log("Awaiting Hash", window.location.hash);
  peer.on("open", function (id) {
    console.log("hi", id);
    uniqueID = peer.id;
  });
  peer.on("error", function (err) {
    console.log(err);
  });
};
initSignal();
const recieve = () => {
  var getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
  peer.on("call", function (call) {
    getUserMedia(
      { video: false, audio: true },
      function (stream) {
        call.answer(stream);
        call.on("stream", async function (remoteStream) {
          let audioPlayer = document.getElementById("audio-player");
          audioPlayer.srcObject = remoteStream;
          audioPlayer.load();
          audioPlayer.play();
          setCallingStatusG("answered");
          let { name } = await await poster(
            "https://nextapp-orpin.vercel.app/api/queryUser",
            {
              id: call.peer,
            }
          );
          setCalleeG({ id: call.peer, name: name });
        });
      },
      function (err) {
        console.log("Failed to get local stream", err);
      }
    );
  });
};
recieve();

const poster = (url, req) =>
  fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(req),
  }).then((res) => res.json());

const connect = async (e, id, setIsConnected) => {
  const mainContainer = document.getElementById("main-container");
  const container = e.target.parentElement;
  const input = container.children[1];
  if (input.value) {
    let isTaken = await poster("https://nextapp-orpin.vercel.app/api/signin", {
      id: id,
      name: input.value,
    });

    if (isTaken.isTaken) {
      container.children[0].style.borderColor = "red";
      return false;
    } else {
      mainContainer.style.opacity = 0;
      setTimeout(() => {
        mainContainer.style.opacity = 1;
        setIsConnected(true);
        return true;
      }, 600);
    }
  }
};
const queryUser = async (userid) => {
  if (userid) {
    let username = await poster(
      "https://nextapp-orpin.vercel.app/api/queryUser",
      {
        id: userid,
      }
    );
    return username;
  }
};
const calling = (number, setCallingStatus, setCallee, name) => {
  console.log(number);
  var getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
  getUserMedia(
    { video: false, audio: true },
    function (stream) {
      var call = peer.call(number, stream);

      call.on("stream", function (remoteStream) {
        let audioPlayer = document.getElementById("audio-player");
        audioPlayer.srcObject = remoteStream;
        audioPlayer.load();
        audioPlayer.play();
        setCallingStatus("answered");
      });
    },

    function (err) {
      console.log("Failed to get local stream", err);
    }
  );
  setCallingStatus("is-calling");
  setCallee({ id: number, name: name });
};

let Login = (setIsConnected) => {
  return (
    <>
      <h1 style={{ fontSize: "7em", color: "white" }}>Sign In</h1>
      <Input
        height="7%"
        width="70%"
        userId={peer.id}
        mouseDownEvent={(e) => {
          connect(e, uniqueID, setIsConnected);
        }}
      />
    </>
  );
};

let Dial = (setCallingStatus, setCallee) => {
  let mainContainer = document.getElementById("main-container");
  mainContainer.style.opacity = 1;
  return (
    <>
      <h1 style={{ fontSize: "7em", color: "white" }}>Dial</h1>
      <h3 style={{ fontSize: "2em", color: "rgb(245, 8, 55)" }}>
        Your #: {uniqueID}
      </h3>
      <Input
        height="7%"
        width="70%"
        userId={peer.id}
        mouseDownEvent={async ({ target }) => {
          let callee = target.parentElement.children[1].value;
          let { name } = await queryUser(callee);
          calling(callee, setCallingStatus, setCallee, name);
        }}
      />
    </>
  );
};

let onCall = (calleeName) => {
  let mainContainer = document.getElementById("main-container");
  mainContainer.style.opacity = 1;
  console.log(calleeName);
  return (
    <>
      <h1 style={{ fontSize: "7em", color: "white" }}>Calling</h1>
      <h3 style={{ fontSize: "2em", color: "rgb(245, 8, 55)" }}>
        Waiting for an answer from {calleeName}
      </h3>
      <Input
        height="7%"
        width="70%"
        userId={peer.id}
        mouseDownEvent={() => {}}
      />
    </>
  );
};

let connected = (name) => {
  let mainContainer = document.getElementById("main-container");
  mainContainer.style.opacity = 1;
  return (
    <>
      <h1
        style={{
          fontSize: "7em",
          color: "rgb(245, 8, 55)",
          marginBottom: "1v",
        }}
      >
        {name}
      </h1>
      <h1 style={{ fontSize: "2em", color: "white" }}>Say hi!</h1>
      <Input
        height="7%"
        width="70%"
        userId={peer.id}
        mouseDownEvent={({ target }) => {
          //calling(target.parentElement.children[1].value);
        }}
      />
    </>
  );
};

export default function Console(props) {
  const [isConnected, setIsConnected] = useState(false);
  const [callingStatus, setCallingStatus] = useState("not-calling");
  const [callee, setCallee] = useState({ id: uniqueID, name: "" });
  setCallingStatusG = setCallingStatus;
  setCalleeG = setCallee;
  console.log(callee.name);
  let Show = isConnected
    ? callingStatus === "not-calling"
      ? () => Dial(setCallingStatus, setCallee)
      : callingStatus === "is-calling"
      ? () => onCall(setCallingStatus, callee.name)
      : () => connected(callee.name)
    : () => Login(setIsConnected);
  return (
    <div id="main-container" className={styles.container}>
      <Show />
      <audio
        id="audio-player"
        controls
        style={{ display: "none" }}
        autoPlay={true}
      />
    </div>
  );
}
