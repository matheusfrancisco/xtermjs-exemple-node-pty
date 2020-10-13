
export class Login {
  constructor({ user, pass }) {
    this.user = user;
    this.pass = pass;
    this._auth = false;
  }

  checkLogin(user, pass) {
    if(user.replace("Enter", "") === this.user && this.pass === pass.replace("Enter", "")) {
        console.log('foi')
        this._auth = true
    } else {
    console.log('foi nao')
    console.log(user)
    console.log('foi nao')
    console.log(pass)

    }
  }

  isAuth() {
    return this._auth
  }
}
