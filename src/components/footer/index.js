import React from 'react';

const Footer = function () {
  const footArr = ["Regler", "Frågor och svar", "Om"];
  const footItems = footArr.map(item => {
    return <li key={item}><a href=""> {item} </a></li> 
  })

  return (
    <footer className="footer">
      <ul>
        {footItems}
      </ul>
    </footer>
  )
}

export default Footer;