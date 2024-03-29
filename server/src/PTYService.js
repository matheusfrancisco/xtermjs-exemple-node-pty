// PTYService.js

const os = require("os");
const pty = require("node-pty");

class PTY {
  constructor(socket) {
    // Setting default terminals based on user os
    this.shell = os.platform() === "win32" ? "powershell.exe" : "bash";
    this.ptyProcess = null;
    this.socket = socket;

    // Initialize PTY process.
    this.startPtyProcess();
  }

  startPtyProcess() {
    this.ptyProcess = pty.spawn(this.shell, [], {
      name: "xterm-color",  
      cwd: process.env.HOME, // Which path should terminal start
      env: process.env // Pass environment variables
    });

    // Add a "data" event listener.
    this.ptyProcess.on("data", data => {
      this.sendToClient(data);
    });
  }

  /**
   * Use this function to send in the input to Pseudo Terminal process.
   * @param {*} data Input from user like command sent from terminal UI
   */

  write(data) {
    this.ptyProcess.write(data);
  }

  sendToClient(data) {
    this.socket.emit("output", data);
  }
}

module.exports = PTY;
