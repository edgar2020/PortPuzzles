import React,{ Component } from 'react';
import './homeOptions.css';
  

class SiteHeader extends Component
{
  render () 
  {
    return (  
      <div className='homeOptions'>
        <h2>Options</h2>
        <button id="load-unload">Load and Unload</button>
        <button id="weight-balancing">Weight Balancing</button>
        <button id="helpButton">Help</button>
      </div>
    )
  }
}
export default SiteHeader;
