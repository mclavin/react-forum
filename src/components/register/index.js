import React, {Component} from 'react';
import firebase from '../../firebase';

export default class Register extends Component {
  state = {
    username: "",
    password: ""
  }

  onChange = e => {
    this.setState({ [e.target.name] : e.target.value})
  }

  //Skapar ny användare i firebase
  createUser = e => {
    e.preventDefault();
    firebase.auth()
      .createUserWithEmailAndPassword(this.state.username, this.state.password)
      .then((user) => {
        firebase.database()
          .ref(`users/${user.uid}`)
          .set({email: user.email, uid: user.uid})
          .catch(error => console.log(error));
      })
  }

  render() {
    return(
      <div className="user">
      <form onSubmit={this.onSubmit}>
        <div>
          <label className="form-control-label" htmlFor="username">Username</label><br></br>
          <input
          type="text"
          className="user-input"
          name="username"
          onChange={this.onChange}
          value={this.state.username}/><br></br>
         <label className="form-control-label" htmlFor="password">Password</label><br></br>
          <input
          type="password"
          className="user-input"
          name="password"
          onChange={this.onChange}
          value={this.state.password}/>
        </div>
        <input className="btn register-btn primary-btn" onClick={this.createUser} type="submit" value="Register"/>
      </form>
    </div>     
    )
  }
}