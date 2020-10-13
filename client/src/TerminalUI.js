// TerminalUI.js

import { Terminal } from "xterm";
import { Login } from './login';
import "xterm/css/xterm.css";

export class TerminalUI {
  constructor(socket) {
    this.terminal = new Terminal();

    /* You can make your terminals colorful :) */
    this.terminal.setOption("theme", {
      background: "#202B33",
      foreground: "#F5F8FA"
    });

    this.socket = socket;
    this.login = new Login({
      user: 'buzzlabs',
      pass: '123123'
    });

    this.data = {
      user: '',
      pass: ''
    };
  }

  /**
   * Attach event listeners for terminal UI and socket.io client
   */
  startListening() {
    this.terminal.onData(data => this.sendInput(data));
    this.socket.on("output", data => {
      this.write(data);
    });
  }


  startLogin1() {
    const login = { text: "\r\n$ >> login:", hasSeen: false };
    const password = { text: "\r\n$ >> password:", hasSeen: false };


    this.terminal.onKey((e) => {
      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
      console.log("op")
      this.sendInput(e.key);
      this.socket.on("output", data => {
        this.write(data);
      });

    });

   
  }



  startLogin() {
    const login = { text: "\r\n$ >> login:", hasSeen: false };
    const password = { text: "\r\n$ >> password:", hasSeen: false };

    console.log(this.login.isAuth(), "2")
    if (!this.login.isAuth()) {
      this.terminal.onKey((e) => {
        const ev = e.domEvent;
        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;


        console.log(ev)
        console.log(this.terminal)
        // ev.view.close()
        if (login.hasSeen) {
          if (password.hasSeen) {

            if (ev.keyCode === 13) {
              this.terminal.write(`\r\n$ `);
              this.login.checkLogin(this.data.user, this.data.pass)
              if (this.login.isAuth) {
                login.hasSeen = false
                password.hasSeen = false
                this.data = { user: "", pass: "" }
              } else {
                login.hasSeen = false
                password.hasSeen = false
                this.data = { user: "", pass: "" }

              }
            }
            if (printable) {
              this.terminal.write(e.key);
              this.data.pass += ev.key;
              console.log(this.data.pass)
            }
          } else {

            console.log(this.terminal)
            console.log(ev)

            if (ev.keyCode === 13) {
              this.terminal.write(`\r\n$ `);

              this.terminal.write(password.text);
              this.terminal.write(`\r\n$ `);

              password.hasSeen = true;

            }
            if (printable) {
              this.terminal.write(e.key);
              this.data.user += ev.key;
              console.log(this.data.user)
            }
          }

        } else {
          if (this.login.isAuth()) {
            this.sendInput(e.key);
          }
          console.log("entrou")
          this.terminal.write(login.text);
          this.terminal.write(`\r\n$ `);

          login.hasSeen = true;
        }
      });

    } else {

      this.terminal.onData(data => this.sendInput(data));
      this.socket.on("output", data => {
        this.write(data);
      });
    }
  }

  /**
   * Print something to terminal UI.
   */
  write(text) {
    this.terminal.write(text);
  }

  /**
   * Utility function to print new line on terminal.
   */
  prompt() {
    this.terminal.write(`\r\n$ `);
  }

  /**
   * Send whatever you type in Terminal UI to PTY process in server.
   * @param {*} input Input to send to server
   */
  sendInput(input) {
    this.socket.emit("input", input);
  }


  /**
   *
   * @param {HTMLElement} container HTMLElement where xterm can attach terminal ui instance.
   */
  attachTo(container) {
    this.terminal.open(container);
    // Default text to display on terminal.
    this.terminal.write("Terminal Connected");
    this.prompt();
  }

  clear() {
    this.terminal.clear();
  }
}
