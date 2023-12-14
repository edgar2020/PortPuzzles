import React,{ Component } from 'react';
import '../css/header.css';
import { saveEvent, signIn, signOut } from '../logFile';
import keoghLogo from '../other/Logo_3.png'
  

class SiteHeader extends Component
{
  submitSignIn(e)
  {
    try {
      e.preventDefault();
      let input = document.getElementById("signIn")
      let currentEmployee = input.value.trim();
      input.value = ""
      if(currentEmployee != "" && currentEmployee.length <= 256) 
      {
        signIn(currentEmployee);
        return;
      }
      else if(currentEmployee.length > 256) 
      {
        alert("Username too long");
      }
      else
      {
        alert("No value entered, please type your name to sign in");
      }
      

    } catch (error) {
      
    }

  }
  endOfYearSignOut(e)
  {
    try {
      e.preventDefault();
      let response = prompt("Initiate END OF YEAR SIGN OUT PROTOCOL?\nType \"YES\" if you want to initialte protocol");
      if(response === "YES")
      {
        saveEvent("Signed out for the year");
        window.location.href="/Signed-out";
      }


    } catch (error) {
      
    }
  }

  render () 
  {
    return (  
      <div className='siteHeader'>
        <div className='keoghLogoContainer'>
          <img src={keoghLogo} className='headerLogo' alt='Keoghs Logo'/>
        </div>

        <div className='rightSideOfHeader'>
          <h1 className='headerTitle'>{this.props.value}</h1>
          <div className="signInContainer">
            <form id="signInForm">
              <input id="signIn" className='signInInput' type="text" placeholder="Username" name="username" max="256" onChange={this.updateInput}/>
              <button className='signInButton' type="submit" onClick={(e)=> this.submitSignIn(e)}>Sign-in</button>
            </form>
          </div>
        </div>
        { this.props.signOut &&
            <button id='endOfYearSignOut' onClick={(e)=> this.endOfYearSignOut(e)}>End of Year</button>
        }


      </div>
    )
  }
}
export default SiteHeader;
