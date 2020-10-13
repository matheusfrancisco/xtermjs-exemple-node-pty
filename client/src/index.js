// index.js

import { TerminalUI } from "./TerminalUI";
import io from "socket.io-client";

// IMPORTANT: Make sure you replace this address with your server address.

const serverAddress = "http://localhost:8080";


function connectToSocket(serverAddress) {
  return new Promise(res => {
    const socket = io(serverAddress);
    res(socket);
  });
}

function startTerminal(container, socket) {

  const terminal = new TerminalUI(socket);

  // Attach created terminal to a DOM element.
  terminal.attachTo(container);


  // terminal.startLogin1();
  terminal.startListening();
}

function start() {
  const login = localStorage.getItem('login');
  const password = localStorage.getItem('password');
  const container = document.getElementById("terminal-container");
  if( login === "buzzlabs" && password === "123123") {

    connectToSocket(serverAddress).then(socket => {
      startTerminal(container, socket);
    });
  } else {
    window.location.href = "http://localhost:1234/login.html"
  }
  // Connect to socket and when it is available, start terminal.
}



// Better to start on DOMContentLoaded. So, we know terminal-container is loaded
start();
