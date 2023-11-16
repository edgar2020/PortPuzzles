import React,{ Component } from 'react';
import './homeOptions.css';
  

class SiteHeader extends Component
{
  render () 
  {
    return (  
      <div className='homeOptions'>
        <h2>Options</h2>
        
        <button id="load-unload"><a href="/LoadUnload">Load and Unload</a></button>
        <button id="weight-balancing"><a href="/Weight">Weight Balancing</a></button>
        <button id="helpButton">Help</button>
      </div>
    )
  }
}
export default SiteHeader;
