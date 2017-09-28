import React, {Component} from 'react';
import NewPost from '../new-post/';
export default class ShowHide extends Component{
  state = {
    childVisible: false
  }
  
  //Klickar vi på knappen blir state.childVisible true/false
  onClick = () => {
    if(!this.state.childVisible)
      this.setState({childVisible: true})
    else
      this.setState({childVisible: false})
    //console.log(this.props.user)
  }

  //Om state.childVisivle === true visar bi en post form
  //Annars gömmer vi den
  render(){
    return(
      <div className="align-center">
        <button className="new-post primary-btn btn" onClick={this.onClick}>
          New post
        </button>
        {
          this.state.childVisible
            ? <NewPost user={this.props.user}/> : null
        }
      </div>
    )  
  }
}
