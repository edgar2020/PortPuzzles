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
        
        <button id="load-unload"><a href="/LoadUnload">Load and Unload</a></button>
        <button id="weight-balancing"><a href="/Weight">Weight Balancing</a></button>
        <button id="helpButton">Help</button>
      </div>
    )
  }
}
export default SiteHeader;
