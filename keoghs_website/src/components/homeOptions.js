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
        <a href="https://docs.google.com/document/d/e/2PACX-1vRmRrrMe055YkEswPame8ZT-4YIx_xd6bC1mpo9w1WWHLa1KvF8mhN14XMwginI7a0q6pOowSDsliuP/pub" target="_blank"><button id="helpButton">Help</button></a>
      </div>
    )
  }
}
export default SiteHeader;
