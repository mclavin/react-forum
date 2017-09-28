import React, {Component} from 'react';
import firebase from '../../firebase';

export default class NewPost extends Component {

  state = {
    statusMessage: null,
    title: '',
    content: '',
    category: ''
  }

  onChange = e => {
    this.setState({ [e.target.name] : e.target.value})
  }

  //Skickar ny post till firebase
  onSubmit = (e) => {
   e.preventDefault();
   const date = new Date();
   firebase.database()
    .ref(`posts`)
    .push({
      title: this.state.title,
      content: this.state.content,
      category: this.state.category,
      uid: this.props.user.email,
      date: date.toLocaleDateString(),
      upvotes: 0,
      downvotes: 0,
    })
    .then(this.setState({statusMessage: 'Your post had been successfully created'}))
  }
  
  render(){
    return(
      <div>
        <form onSubmit={this.onSubmit}>
          <div className="create-post">
            <label className="form-control-label" htmlFor="title">Titel</label><br></br>
            <input
              type="text"
              name="title"
              onChange={this.onChange}
              value={this.state.title}/><br></br>
            <label className="form-control-label" htmlFor="content">Innehåll</label><br></br>
            <textarea
              className="form-control-area"
              type="text"
              name="content"
              onChange={this.onChange}
              value={this.state.content}/><br></br>
            <select onChange={this.onChange} name="category" value={this.state.category}>
              <option>Välj en kategori</option>
              <option value="floor">Golv</option>
              <option value="roof">Tak</option>
              <option value="wall">Vägg</option>
              <option value="other">Annat</option>
            </select>
            {this.state.statusMessage !== null &&
              <p>{
                this.state.statusMessage}
              </p> 
            }
          </div>
          <input className="new-post secondary-btn btn" type="submit" value="Post"/>
        </form>  
      </div>
    )
  }
}