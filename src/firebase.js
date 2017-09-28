import firebase from 'firebase';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAq2ZiMFk3Wj6kTyGzt6HQMFEpbcNXNjSY",
  authDomain: "exam-a4045.firebaseapp.com",
  databaseURL: "https://exam-a4045.firebaseio.com",
  projectId: "exam-a4045",
  storageBucket: "",
  messagingSenderId: "747862055042"
};
firebase.initializeApp(config);

export default firebase;