import React,{ Component } from 'react';
import './header.css';
import keoghLogo from '../other/placeholder-logo.png'
  

class SiteHeader extends Component
{
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
            <form action="/action_page.php">
              <input className='signInInput' type="text" placeholder="Username" name="username"/>
              <button className='signInButton' type="submit">Sign-in</button>
            </form>
          </div>
        </div>


      </div>
    )
  }
}
export default SiteHeader;
