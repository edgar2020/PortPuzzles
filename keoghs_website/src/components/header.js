import React,{ Component } from 'react';
import '../css/header.css';
import { signIn } from '../logFile';
import keoghLogo from '../other/Logo_3.png'
  

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
  endOfYearSignOut(e)
  {
    try {
      e.preventDefault();
      let response = prompt("Initiate END OF YEAR SIGN OUT PROTOCOL?\nType \"YES\" if you want to initialte protocol");
      if(response === "YES")
      {
        window.location.href="/Signed-out";
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
          <h1 className='headerTitle'>{this.props.value}</h1>
          <div className="signInContainer">
            <form id="signInForm">
              <input id="signIn" className='signInInput' type="text" placeholder="Username" name="username" onChange={this.updateInput}/>
              <button className='signInButton' type="submit" onClick={(e)=> this.submitSignIn(e)}>Sign-in</button>
            </form>
          </div>
        </div>
        <button id='endOfYearSignOut' onClick={(e)=> this.endOfYearSignOut(e)}>End of Year</button>


      </div>
    )
  }
}
export default SiteHeader;
