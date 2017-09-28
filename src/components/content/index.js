import React, {Component} from 'react';
import firebase from '../../firebase';
import ShowHide from '../show-hide/';
import Filter from '../filter/';
import LoginForm from '../login-form';
import Footer from '../footer/';
export default class Content extends Component{
  
  state = {
    posts: [],
    search: '',
    selectedRadio: '',
    categories: [],
    tempCategories: [],
    error: ''
  }

  //Hämtar posts från databasen
  componentDidMount(){
    this.setState({error: ''});
    const ref = firebase.database().ref("posts").orderByChild("date").limitToLast(10);
    ref.on('value', (snapshot) => {
      const list = [];
      snapshot.forEach(function(ref){
        list.push({ title: ref.val().title, content: ref.val().content,
          key: ref.key, upvotes: ref.val().upvotes,
          downvotes: ref.val().downvotes, hasvoted: ref.val().hasvoted, date: ref.val().date })
      })
      this.setState({posts: list})
    })
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value})
  }
  
  //Funktion för att feltrera posts ur databasen med ett inputfält
  onSearch = (e) => {
    e.preventDefault();
    if(this.state.search.length === 0){
      this.setState({error: 'Vänligen mata in något i sökfältet'})
    }
    else{
      const ref = firebase.database().ref("posts");
      ref.orderByChild("title")
      .equalTo(this.state.search)
      .on('value', (snapshot) => {
        const list = [];
        snapshot.forEach(function(ref){
          list.push({ title: ref.val().title, content: ref.val().content,
            key: ref.key, upvotes: ref.val().upvotes,
            downvotes: ref.val().downvotes, date: ref.val().date})
        })
        if (list.length === 0){
          this.setState({error: 'Inga inlägg hittades'})
        }
        this.setState({posts: list})
      })
    }
  }

  //Funktion för att filtrera databasen med 2st radios
  filterByRadio = (e) => {
    this.setState({selectedRadio: e.target.value}, function(){
      if(this.state.selectedRadio === 'my-posts'){
        const ref = firebase.database().ref("posts");
        ref.orderByChild("uid")
        .equalTo(this.props.user.email)
        .on('value', (snapshot) => {
          const list = [];
          snapshot.forEach(function(ref){
            list.push({ title: ref.val().title, content: ref.val().content,
              key: ref.key, upvotes: ref.val().upvotes,
              downvotes: ref.val().downvotes, date: ref.val().date, hasvoted: ref.val().hasvoted})
          })
          this.setState({posts: list})
        })
      }
      else if(this.state.selectedRadio === 'all-posts'){
        this.componentDidMount();
      }
    })
  }

  //Matar in värdet på olika checkboxes till this.state.tempCategories
  checkboxToArr = (e) => {
    if (e.target.checked){
      this.state.tempCategories.push(e.target.value)
    }
    else if (!e.target.checked){
      for (let i = 0; i <= this.state.tempCategories.length; i++){
        if (this.state.tempCategories[i] === e.target.value){
          this.state.tempCategories.splice(i, 1);
        }
      }
    }
    const list = []
    this.filterByCheckbox(list)
  }

  //Sätter categories i state till tempCategories där alla checkboxvärden finns
  //Filtrerar sedan posts ur databasen utifrån dessa värden
   /*
    Lyckades ej lösa problem om man röstar på en post när alla posts är
    filtrerade med checkboxes. Alla posts blir typ dubblerade när man röstar, tills man gör en refresh på sidan
    eller filtrerar på nytt
   */
  filterByCheckbox = (list) => {
    this.setState({categories: this.state.tempCategories}, function() {
      const ref = firebase.database().ref("posts");
      for (let i = 0; i < this.state.categories.length; i++){
        ref.orderByChild("category")
        .equalTo(this.state.categories[i])
        .on('value', (snapshot) => {
          snapshot.forEach(function(ref){
            list.push({ title: ref.val().title, content: ref.val().content,
              key: ref.key, upvotes: ref.val().upvotes,
              downvotes: ref.val().downvotes, date: ref.val().date, hasvoted: ref.val().hasvoted})
          })
          this.setState({posts: list})
        })
      }
      //Om inga ckeckboxes är checked kör vi ComponentDidMount igen
      if (this.state.categories.length === 0){
        this.componentDidMount();
      }
    })
  }

  //Hanterar upvotes på posts och matar in den aktiva användaren i hasvoted
  //för att användaren inte ska kunna rösta på samma posts flera gånger
  handleUpvote = (post, key) => {
    //firebase.database().ref(`posts/${post.key}/upvotes`).push(this.props.user.email)
    firebase.database().ref(`posts/${post.key}`).update({
      upvotes: post.upvotes +1,
    })
    firebase.database().ref(`posts/${post.key}/hasvoted`).push(this.props.user.email);
  }
  
  //Hanterar downvotes på posts och matar in den aktiva användaren i hasvoted
  //för att användaren inte ska kunna rösta på samma posts flera gånger
  handleDownvote = (post, key) => {
    //firebase.database().ref(`posts/${post.key}/upvotes`).push(this.props.user.email)
    firebase.database().ref(`posts/${post.key}`).update({
      downvotes: post.downvotes +1
    })
    firebase.database().ref(`posts/${post.key}/hasvoted`).push(this.props.user.email);  
  }

  render(){
    const posts = this.state.posts;
    const _this = this;
    return (
      <div>
        <LoginForm user={this.props.user}/>
        <Filter
          user={this.props.user} 
          search={this.onSearch}
          onChange={this.onChange}
          radioStatus={this.state.selectedRadio}
          filter={this.filterByRadio}
          checkboxToArr={this.checkboxToArr}/>
        {
          this.props.user &&
          <ShowHide user={this.props.user}/>
        }
        {
          this.state.error.length > 0 &&
          <p className="error align-center">{this.state.error}</p>
        }
        <div className="posts">
          {Object.keys(posts).map(function(key) {
            let vote = '';
            var user = {};
            //Kollar om envändaren har röstat på posten som skall returneras
            for(let vote in posts[key].hasvoted){
              let userVote = posts[key].hasvoted[vote];
              if (userVote === _this.props.user.email){
                user = userVote; 
              }   
            }
            //Om användaren har röstat skriver vi ut detta
            if(user === _this.props.user.email){
              vote = <div className="vote-container">Du har röstat på denna post</div>
            }
            //Om användaren inte har röstat visas röstknappar
            else if (_this.props.user){
              vote = <div className="vote-container">
                      <button
                        className="upvote vote-btn"
                        onClick={ _this.handleUpvote.bind(this, posts[key], key) }
                        type="button">
                       Upvote
                      </button>
                      <button
                        className="downvote vote-btn"
                        onClick={ _this.handleDownvote.bind(this, posts[key], key) }
                        type="button">
                        Downvote
                      </button>
                    </div>; 
            }
            return (
              <div className="post" key={key}>
                <h2>{ posts[key].title }</h2>
                <p>{ posts[key].content }</p>
                <div className="vote-count">
                  <div>Upvotes:<label className="upvote-count"> {posts[key].upvotes}</label></div>
                  <div>Downvotes:<label className="downvote-count"> {posts[key].downvotes}</label></div>
                </div>
                {vote}
              </div>
            )
          })}
        </div>  
        <Footer/>
      </div>
    )
  }
}
