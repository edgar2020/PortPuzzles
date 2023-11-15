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

        {/* middle */}
        <h1 className='headerTitle'>Keogh's Port</h1>

        {/* right */}
        
      </div>
    )
  }
}
export default SiteHeader;
