import React,{ Component } from 'react';
import '../css/homeOptions.css';
import '../css/tasks.css'

class SiteHeader extends Component
{
  render () 
  {
    return (  
      <div id='homeOptions' className='page'>
        <h2>Options</h2>
        
        <a href="/LoadUnload"><button id="load-unload">Load and Unload</button></a>
        <a href="/Weight"><button id="weight-balancing">Weight Balancing</button></a>
        <button id="helpButton">Help</button>
      </div>
    )
  }
}
export default SiteHeader;
