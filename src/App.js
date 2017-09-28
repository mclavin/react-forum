import React, { Component } from 'react';
import './App.css';
import firebase from './firebase';
import Content from './components/content/';
class App extends Component {
  
  state = {
    user: ''
  }
  
  componentDidMount() {
    firebase.auth()
      .onAuthStateChanged((user) => {
        if (user)
          this.setState({user: user});  
        else
          this.setState({user: ''});

        firebase.auth().getRedirectResult().then(function(result) {
          if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // ...
            }
            // The signed-in user info.
            var user = result.user;
            console.log(user);
            this.setState({user: user});
          }).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
          });
    })
  }



  render() {
    return (
      <Content user={this.state.user}/>
    );
  }
}

export default App;
