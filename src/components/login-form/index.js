import React, { Component } from 'react';
import firebase from '../../firebase';
import Register from '../register';
class LoginForm extends Component {
  state = {
      username: '',
      password: '',
      register: false,
      error: false
  }

  onChange = e => {
    this.setState({ [e.target.name] : e.target.value })
  }

  onSubmit = e => {
    e.preventDefault();
    firebase.auth()
      .signInWithEmailAndPassword(this.state.username, this.state.password)
      .catch(error => this.setState({error: error.message}))
  }

  googleLogIn = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    //provider.addScope('https://www.googleapis.com/auth/plus.login');
    firebase.auth().signInWithRedirect(provider).then(function(result) {
    })
    
    .catch(function(error) {
      console.log(error);
    })


  }

  onLogout = () => {
    firebase.auth()
     .signOut();
  }

  showRegister = () => {
    if (this.state.register === false)
      this.setState({register: true})
    else
      this.setState({register: false})
  }

  render() {
    //Finns användaren visas 2 radios för att filtrera, Mina- och Alla posts
    if(this.props.user){
      return(
        <div className="user">
          <label className="user">Inloggad som {this.props.user.email}</label><br></br>
          <button className="secondary-btn btn" onClick={this.onLogout}> Logout </button>
        </div>
      )
    }
    else{
      //Finns det ingen anvädare visas reg-knapp
      if(this.state.register === true){
        return <Register />
      }
      else{
        return (
          <div className="user">
            <form>
              <div>
                <label className="user-label" htmlFor="username">Username</label><br></br>
                <input
                type="text"
                className="user-input"
                name="username"
                onChange={this.onChange}
                value={this.state.username}/>
              </div>
              <div>
                <label className="" htmlFor="password">Password</label><br></br>
                <input
                type="password"
                className="user-input"
                name="password"
                onChange={this.onChange}
                value={this.state.password}/>
              </div>
              {
                this.state.error && 
                <p> {this.state.error} </p>
              }
              <input className="btn primary-btn" onClick={this.onSubmit} type="submit" value="Sign in"/><br></br>
              <button className="btn secondary-btn" onClick={this.googleLogIn}>Sign in with Google</button>
            </form>
            <button className="btn secondary-btn" onClick={this.showRegister}> Register </button>
        </div>
        );
      }
    }
  }
}

export default LoginForm;