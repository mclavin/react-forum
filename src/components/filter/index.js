import React from 'react';

export default function Filter (props) {
    return (
      <div className="align-center">
        <form>
          <input className="search-input" type="text" name="search" onChange={props.onChange} placeholder="search"/>
          <input className="search-btn secondary-btn" value="Sök" type="submit" onClick={props.search}/>
        </form>
        {props.user &&
          <form className="radio-btn">
            <label>Mina posts</label>
            <input type="radio" name="filter" value="my-posts" checked={props.radioStatus === 'my-posts'} onClick={props.filter}/>
            <label>Alla posts</label>
            <input type="radio" name="filter" value="all-posts" checked={props.radioStatus === 'all-posts'} onClick={props.filter}/>
          </form>
        }
        <form className="checkbox-container">
          <label>Golv</label>
          <input type="checkbox" name="checkbox" value="floor" onClick={props.checkboxToArr}/>
          <label>Tak</label>
          <input type="checkbox" name="checkbox" value="roof" onClick={props.checkboxToArr}/>
          <label>Vägg</label>
          <input type="checkbox" name="checkbox" value="wall" onClick={props.checkboxToArr}/>
          <label>Annat</label>
          <input type="checkbox" name="checkbox" value="other" onClick={props.checkboxToArr}/>
        </form>
        {props.children}
      </div> 
  )
  }
