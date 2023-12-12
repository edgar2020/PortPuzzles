import React,{ Component } from 'react';
import '../css/header.css';
import { signIn } from '../logFile';
import keoghLogo from '../other/placeholder-logo.png'
  

class SiteHeader extends Component
{
  submitSignIn(e)
  {
    try {
      e.preventDefault();
      let input = document.getElementById("signIn")
      let currentEmployee = input.value;
      input.value = ""
      if(currentEmployee != "") 
      {
        // console.log("esf");
        signIn(currentEmployee);
      }

    } catch (error) {
      
    }

  }

  render () 
  {
    return (  
      <div className='siteHeader'>
        {/* left */}
        <div className='keoghLogoContainer'>
          <img src={keoghLogo} className='headerLogo' alt='Keoghs Logo'/>
        </div>

        {/* right */}

        <div className='rightSideOfHeader'>
          <h1 className='headerTitle'>Keogh's Port</h1>
          <div className="signInContainer">
            <form id="signInForm">
              <input id="signIn" className='signInInput' type="text" placeholder="Username" name="username" onChange={this.updateInput}/>
              <button className='signInButton' type="submit" onClick={(e)=> this.submitSignIn(e)}>Sign-in</button>
            </form>
          </div>
        </div>


      </div>
    )
  }
}
export default SiteHeader;
